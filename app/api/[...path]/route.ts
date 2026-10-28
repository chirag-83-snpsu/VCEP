import {env} from 'cloudflare:workers';
import {unzipSync} from 'fflate';
import baseSessions from '@/lib/sessions.json';
import legacySessions from '@/lib/legacy-sessions.json';
import {exportWork} from '@/lib/export-work';
import {zipSync} from 'fflate';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {cleanAnswers,requiredAnswers,validGrade,mayReview} from '@/lib/rules';
import {getAuthorizedLesson} from '@/lib/guided-content.server';
import {
  hashPassword,
  verifyPassword,
  generateInvitationToken,
  hashToken,
  getSessionTokenFromCookie,
  buildSessionCookie,
  buildClearSessionCookie,
} from '@/lib/auth-crypto.server';
const ownerEmail='vayentragurukula@gmail.com';
const now=()=>new Date().toISOString();
const id=()=>crypto.randomUUID();
let authTablesReady = false;
async function ensureAuthTables(db: any) {
  if (authTablesReady || !db) return;
  try {
    await db.prepare('CREATE TABLE IF NOT EXISTS auth_credentials (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL)').run();
    await db.prepare('CREATE TABLE IF NOT EXISTS invitations (id TEXT PRIMARY KEY, email TEXT NOT NULL, token_hash TEXT UNIQUE NOT NULL, role TEXT NOT NULL, cohort TEXT NOT NULL, expires TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL)').run();
    await db.prepare('CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, email TEXT NOT NULL, created TEXT NOT NULL, expires TEXT NOT NULL, user_agent TEXT, ip_hash TEXT)').run();
    authTablesReady = true;
  } catch {}
}
class HttpError extends Error{constructor(public status:number,msg:string){super(msg)}}
function fail(status:number,msg:string):never{throw new HttpError(status,msg)}
async function bounded(req:Request,max:number){const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>max){await reader.cancel();fail(413,'Request exceeds its size limit')}chunks.push(r.value)}const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return bytes}
async function readJSON(req:Request){try{return JSON.parse(new TextDecoder().decode(await bounded(req,250000)))}catch(e){if(e instanceof HttpError)throw e;fail(400,'Invalid JSON request')}}
const json=(o:any,status=200,extraHeaders:Record<string,string>={})=>Response.json(o,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extraHeaders}});
async function run(req:Request){
 const path=new URL(req.url).pathname.slice(5).split('/');
 const db=(env as any).DB as D1Database;const bucket=(env as any).BUCKET as R2Bucket;
 if(!db)fail(503,'The learning workspace is being configured. Downloadable worksheets remain available.');
 await ensureAuthTables(db);
 const q=(s:string,...v:any[])=>db.prepare(s).bind(...v);
 const all=async(s:string,...v:any[])=>(await q(s,...v).all()).results as any[];
 const one=async(s:string,...v:any[])=>await q(s,...v).first<any>();
 const log=(actor:string,event:string,target:string)=>q('INSERT INTO audit VALUES(?,?,?,?,?)',id(),actor,event,target,now());
 const note=(owner:string,message:string)=>q('INSERT INTO notifications VALUES(?,?,?,?,0)',id(),owner,message,now());

 if(req.method!=='GET'){
  if(req.headers.get('origin')!==new URL(req.url).origin)fail(403,'Request origin rejected');
  if(Number(req.headers.get('content-length')||0)>5500000)fail(413,'File or request is too large');
 }

 if(path[0]==='auth'){
  const isHttps = new URL(req.url).protocol === 'https:';
  if(path[1]==='signin'&&req.method==='POST'){
   const b:any=await readJSON(req);
   const em=String(b.email||'').trim().toLowerCase();
   const pwd=String(b.password||'');
   if(!em||!pwd)fail(400,'Enter your email and password');
   const cred=await one('SELECT * FROM auth_credentials WHERE email=?',em);
   if(!cred){
    const rosterEntry=await one('SELECT * FROM roster WHERE email=?',em);
    if(rosterEntry||em===ownerEmail)return json({error:'Your account is not activated yet. Use your invitation link or ask your college coordinator.',needsActivation:true},403);
    fail(401,'Invalid email or password');
   }
   const valid=await verifyPassword(pwd,cred.salt,cred.password_hash);
   if(!valid){await log(em,'auth_failed','password_mismatch').run();fail(401,'Invalid email or password');}
   const existingUser=await one('SELECT id,name FROM users WHERE email=?',em);
   const uid=existingUser?.id||cred.id||id();
   const enrollment=await one('SELECT * FROM roster WHERE email=?',em);
   const role=em===ownerEmail?'admin':enrollment?.role||'pending';
   const cohort=enrollment?.cohort||'';
   const name=enrollment?.name||existingUser?.name||em.split('@')[0];
   await q('INSERT INTO users VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name',uid,em,name,now()).run();
   const sid=id();
   const expiresAt=new Date(Date.now()+7*86400000).toISOString();
   await q('INSERT INTO sessions VALUES(?,?,?,?,?,?,NULL)',sid,uid,em,now(),expiresAt,req.headers.get('user-agent')?.slice(0,200)||'').run();
   await log(uid,'auth_login',sid).run();
   const redirectUrl=role==='admin'?'/?view=admin':role==='faculty'?'/?view=faculty':role==='student'?'/':'/account/pending';
   return json({ok:true,user:{id:uid,email:em,name,role,cohort},redirectUrl},200,{'Set-Cookie':buildSessionCookie(sid,7*86400,isHttps)});
  }
  if(path[1]==='signout'&&req.method==='POST'){
   const token=getSessionTokenFromCookie(req.headers.get('cookie'));
   if(token)await q('DELETE FROM sessions WHERE id=?',token).run();
   return json({ok:true},200,{'Set-Cookie':buildClearSessionCookie(isHttps)});
  }
  if(path[1]==='invitation'&&req.method==='GET'){
   const token=new URL(req.url).searchParams.get('token');
   if(!token)fail(400,'Missing invitation token');
   const tokenHash=await hashToken(token);
   const inv=await one('SELECT * FROM invitations WHERE token_hash=? AND used=0 AND expires>?',tokenHash,now());
   if(!inv)fail(404,'This invitation link is invalid or has expired. Ask your college coordinator for a new invitation.');
   const cohortRecord=await one('SELECT name FROM cohorts WHERE id=?',inv.cohort);
   return json({ok:true,email:inv.email,role:inv.role,cohort:inv.cohort,cohortName:cohortRecord?.name||inv.cohort});
  }
  if(path[1]==='activate'&&req.method==='POST'){
   const b:any=await readJSON(req);
   const token=String(b.token||'').trim();
   const pwd=String(b.password||'');
   const name=String(b.name||'').trim();
   if(!token)fail(400,'Missing invitation token');
   if(!pwd||pwd.length<8)fail(400,'Password must be at least 8 characters');
   const tokenHash=await hashToken(token);
   const inv=await one('SELECT * FROM invitations WHERE token_hash=? AND used=0 AND expires>?',tokenHash,now());
   if(!inv)fail(400,'This invitation link is invalid or has expired');
   const em=inv.email.toLowerCase();
   const {hash:pwHash,salt}=await hashPassword(pwd);
   const enrollment=await one('SELECT * FROM roster WHERE email=?',em);
   const displayName=name||enrollment?.name||em.split('@')[0];
   const existingUser=await one('SELECT id FROM users WHERE email=?',em);
   const uid=existingUser?.id||id();
   const credId=id();
   await db.batch([
    q('UPDATE invitations SET used=1 WHERE id=?',inv.id),
    q('INSERT INTO auth_credentials VALUES(?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,salt=excluded.salt,updated=excluded.updated',credId,em,pwHash,salt,now(),now()),
    q('INSERT INTO users VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email',uid,em,displayName,now()),
    log(uid,'auth_activated',em)
   ]);
   const sid=id();
   const expiresAt=new Date(Date.now()+7*86400000).toISOString();
   await q('INSERT INTO sessions VALUES(?,?,?,?,?,?,NULL)',sid,uid,em,now(),expiresAt,req.headers.get('user-agent')?.slice(0,200)||'').run();
   const role=em===ownerEmail?'admin':enrollment?.role||inv.role||'pending';
   const redirectUrl=role==='admin'?'/?view=admin':role==='faculty'?'/?view=faculty':role==='student'?'/':'/account/pending';
   return json({ok:true,user:{id:uid,email:em,name:displayName,role,cohort:inv.cohort},redirectUrl},200,{'Set-Cookie':buildSessionCookie(sid,7*86400,isHttps)});
  }
  fail(404,'Not found');
 }

 let auth=await getChatGPTUser();
 if(!auth&&db){
  const token=getSessionTokenFromCookie(req.headers.get('cookie'));
  if(token){
   const sess=await one('SELECT * FROM sessions WHERE id=? AND expires>?',token,now());
   if(sess){
    const uRec=await one('SELECT name FROM users WHERE id=?',sess.user_id)||await one('SELECT name FROM roster WHERE email=?',sess.email);
    auth={userId:sess.user_id,email:sess.email,displayName:uRec?.name||sess.email.split('@')[0],fullName:uRec?.name||null};
   }
  }
 }
 if(req.method!=='GET'){
  if(req.headers.get('origin')!==new URL(req.url).origin)fail(403,'Request origin rejected');
  if(Number(req.headers.get('content-length')||0)>5500000)fail(413,'File or request is too large');
 }
 const sessionData=async()=>{const overrides=await all('SELECT * FROM content');return baseSessions.map(s=>{const o=overrides.find(o=>o.session===s.id);return o&&JSON.parse(o.body).curriculumEdition===s.curriculumEdition?JSON.parse(o.body):s})};
 if(!auth){if(path[0]==='boot')return json({user:null,sessions:await sessionData()});if(path[0]==='guided')fail(401,'Sign in with an enrolled account to view this guided lesson');if(path[0]==='template')fail(401,'Sign in with an enrolled account to download worksheets');fail(401,'Sign in to continue')}
 const email=auth.email.toLowerCase();const uid=auth.userId;
 const enrollment=await one('SELECT * FROM roster WHERE email=?',email);
 const role=email===ownerEmail?'admin':enrollment?.role||'pending';
 const cohort=enrollment?.cohort||'';
 const profile={id:uid,email,name:enrollment?.name||auth.displayName,role,cohort,studentId:enrollment?.studentId||'',consent:enrollment?.consent||0};
 await q('INSERT INTO users VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name',uid,email,profile.name,now()).run();
 const admin=()=>{if(role!=='admin')fail(403,'Administrator access required')};
 const staff=()=>{if(!['faculty','admin'].includes(role))fail(403,'Faculty access required')};
 const student=()=>{if(role!=='student')fail(403,'Enrolled student access required');if(!profile.consent)fail(403,'Your college must confirm the required participation consent before you save work')};
 const sessionId=Number(path[1]);
 const sessions=await sessionData();
 const getSession=()=>sessions.find(s=>s.id===sessionId)||fail(404,'Session not found');
 const draftKey=()=>`${uid}:${sessionId}`;
 const sessionForAnswers=(a:any)=>a?._curriculumEdition===getSession().curriculumEdition?getSession():legacySessions.find(v=>v.id===sessionId)||getSession();
 const getDraft=()=>one('SELECT * FROM drafts WHERE id=?',draftKey());
 const available=async()=>{const c=await one('SELECT * FROM cohorts WHERE id=?',cohort);if(!c)fail(403,'No active cohort');const a=await one('SELECT * FROM assignments WHERE cohort=? AND session=?',cohort,sessionId);if(a?.unlock&&a.unlock>now())fail(403,'This session has not opened yet');if(c.policy==='sequential'&&sessionId>1){const previous=await one("SELECT id FROM submissions WHERE owner=? AND session=? AND status IN ('Submitted','Under review','Graded')",uid,sessionId-1);if(!previous)fail(403,'Submit the previous session to unlock this one')}return a};
 if(path[0]==='boot'){
  if(role==='pending')return json({user:profile,sessions});
  if(role==='student'){
   const [drafts,submissions,assignments,extensions,notifications,uploads,c]=await Promise.all([all('SELECT session,revision,updated,status FROM drafts WHERE owner=?',uid),all('SELECT id,session,created,status,late,grade,feedback FROM submissions WHERE owner=? ORDER BY created DESC',uid),all('SELECT * FROM assignments WHERE cohort=?',cohort),all('SELECT * FROM extensions WHERE email=?',email),all('SELECT * FROM notifications WHERE owner=? ORDER BY created DESC LIMIT 50',uid),all('SELECT * FROM uploads WHERE owner=?',uid),one('SELECT * FROM cohorts WHERE id=?',cohort)]);
   return json({user:profile,sessions,drafts,submissions,assignments,extensions,notifications,uploads,cohort:c});
  }
  const [cohorts,roster,queue,assignments,notifications]=await Promise.all([role==='admin'?all('SELECT * FROM cohorts'):all('SELECT * FROM cohorts WHERE id=?',cohort),role==='admin'?all('SELECT r.*, CASE WHEN ac.email IS NOT NULL THEN 1 ELSE 0 END as activated, (SELECT count(*) FROM invitations i WHERE lower(i.email)=lower(r.email) AND i.used=0 AND i.expires>?) as pending_invites FROM roster r LEFT JOIN auth_credentials ac ON lower(r.email)=lower(ac.email)',now()):all('SELECT r.*, CASE WHEN ac.email IS NOT NULL THEN 1 ELSE 0 END as activated, (SELECT count(*) FROM invitations i WHERE lower(i.email)=lower(r.email) AND i.used=0 AND i.expires>?) as pending_invites FROM roster r LEFT JOIN auth_credentials ac ON lower(r.email)=lower(ac.email) WHERE r.cohort=?',now(),cohort),role==='admin'?all('SELECT id,owner,email,name,cohort,session,created,status,late,grade,feedback FROM submissions ORDER BY created DESC LIMIT 2000'):all('SELECT id,owner,email,name,cohort,session,created,status,late,grade,feedback FROM submissions WHERE cohort=? ORDER BY created DESC LIMIT 2000',cohort),role==='admin'?all('SELECT * FROM assignments'):all('SELECT * FROM assignments WHERE cohort=?',cohort),all('SELECT * FROM notifications WHERE owner=? ORDER BY created DESC LIMIT 50',uid)]);
  return json({user:profile,sessions,cohorts,roster,queue,assignments,notifications});
 }
 if(path[0]==='guided'){
  if(req.method!=='GET')fail(405,'Method not allowed');
  const targetId=path[1]==='session'?Number(path[2]):Number(path[1]);
  if(!Number.isInteger(targetId)||targetId<1||targetId>24)fail(400,'Invalid session ID');
  if(role==='pending')fail(403,'Awaiting college enrolment confirmation');
  if(role==='student'){
   if(!profile.consent)fail(403,'Your college must confirm the required participation consent before you access course lessons');
   const c=await one('SELECT * FROM cohorts WHERE id=?',cohort);
   if(!c)fail(403,'No active cohort assigned');
   const a=await one('SELECT * FROM assignments WHERE cohort=? AND session=?',cohort,targetId);
   if(a?.unlock&&a.unlock>now())fail(403,'This session has not opened yet');
   if(c.policy==='sequential'&&targetId>1){
    const previous=await one("SELECT id FROM submissions WHERE owner=? AND session=? AND status IN ('Submitted','Under review','Graded')",uid,targetId-1);
    if(!previous)fail(403,'Submit the previous session worksheet to unlock this lesson');
   }
  }else if(role==='faculty'){
   if(!cohort)fail(403,'Faculty member has no assigned cohort');
  }else if(role!=='admin'){
   fail(403,'Unauthorized');
  }
  const lesson=getAuthorizedLesson(targetId);
  if(!lesson)fail(404,'Lesson not found');
  return Response.json({lesson},{status:200,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(path[0]==='template'){
  if(req.method!=='GET')fail(405,'Method not allowed');
  if(role==='pending')fail(403,'Awaiting college enrolment confirmation');
  const ss=await sessionData();
  if(path[1]==='all'){
   if(role==='student'){
    if(!profile.consent)fail(403,'Your college must confirm participation consent before downloading worksheets');
    const c=await one('SELECT * FROM cohorts WHERE id=?',cohort);
    if(!c)fail(403,'No active cohort assigned');
    const entries:Record<string,Uint8Array>={};
    for(const s of ss){
     const a=await one('SELECT * FROM assignments WHERE cohort=? AND session=?',cohort,s.id);
     if(a?.unlock&&a.unlock>now())continue;
     if(c.policy==='sequential'&&s.id>1){
      const prev=await one("SELECT id FROM submissions WHERE owner=? AND session=? AND status IN ('Submitted','Under review','Graded')",uid,s.id-1);
      if(!prev)continue;
     }
     entries[`S${String(s.id).padStart(2,'0')}_Student_Worksheet.docx`]=new Uint8Array(await (await exportWork(s,{},profile.name||'Student name ____________________')).arrayBuffer());
    }
    if(Object.keys(entries).length===0)fail(403,'No session worksheets are unlocked for your cohort yet');
    return new Response(new Uint8Array(zipSync(entries)),{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="VCEP_Permitted_Worksheets.zip"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
   }
   if(role==='faculty'&&!cohort)fail(403,'Faculty member has no assigned cohort');
   if(!['faculty','admin'].includes(role))fail(403,'Unauthorized');
   const entries:Record<string,Uint8Array>={};
   for(const s of ss)entries[`S${String(s.id).padStart(2,'0')}_Student_Worksheet.docx`]=new Uint8Array(await (await exportWork(s,{},'Student name ____________________')).arrayBuffer());
   return new Response(new Uint8Array(zipSync(entries)),{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="VCEP_24_India_Case_Worksheets.zip"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }
  const targetSession=Number(path[1]);
  if(!Number.isInteger(targetSession)||targetSession<1||targetSession>24)fail(400,'Invalid session ID');
  if(role==='student'){
   if(!profile.consent)fail(403,'Your college must confirm participation consent before downloading worksheets');
   const c=await one('SELECT * FROM cohorts WHERE id=?',cohort);
   if(!c)fail(403,'No active cohort assigned');
   const a=await one('SELECT * FROM assignments WHERE cohort=? AND session=?',cohort,targetSession);
   if(a?.unlock&&a.unlock>now())fail(403,'This session worksheet has not opened yet');
   if(c.policy==='sequential'&&targetSession>1){
    const prev=await one("SELECT id FROM submissions WHERE owner=? AND session=? AND status IN ('Submitted','Under review','Graded')",uid,targetSession-1);
    if(!prev)fail(403,'Submit the previous session worksheet to unlock this download');
   }
  }else if(role==='faculty'){
   if(!cohort)fail(403,'Faculty member has no assigned cohort');
  }else if(role!=='admin'){
   fail(403,'Unauthorized');
  }
  const s=ss.find(v=>v.id===targetSession);
  if(!s)fail(404,'Session not found');
  return new Response(await exportWork(s,{},profile.name||'Student name ____________________'),{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','Content-Disposition':`attachment; filename="VCEP_S${String(s.id).padStart(2,'0')}_Worksheet.docx"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(path[0]==='notifications'&&req.method==='POST'){await q('UPDATE notifications SET seen=1 WHERE owner=?',uid).run();return json({ok:true})}
 if(path[0]==='draft'){
  student();getSession();await available();let d=await getDraft();
  if(req.method==='GET'){const previous=await one('SELECT answers FROM submissions WHERE owner=? AND session=? ORDER BY created DESC LIMIT 1',uid,sessionId);return json({sessionSnapshot:previous&&!['Draft'].includes(d?.status)?JSON.parse(previous.answers)._session:d?JSON.stringify(sessionForAnswers(JSON.parse(d.answers))):null,draft:d?{...d,answers:JSON.parse(d.answers)}:{answers:{},revision:0,status:'Draft'},versions:await all('SELECT id,revision,created FROM versions WHERE draft=? ORDER BY revision DESC LIMIT 10',draftKey()),uploads:await all('SELECT * FROM uploads WHERE owner=? AND session=?',uid,sessionId)});}
  if(!['Draft','Returned'].includes(d?.status||'Draft'))fail(409,'This submission is locked. Faculty must return it for revision.');
  const b:any=await readJSON(req);let answers:Record<string,string>={};if(!b.restore&&!b.startNewEdition){try{answers=cleanAnswers(b.answers)}catch(e){fail(400,e instanceof Error?e.message:'Invalid worksheet')}}
  if(b.restore){const v=await one('SELECT * FROM versions WHERE id=? AND draft=?',String(b.restore),draftKey());if(!v)fail(404,'Version not found');answers=JSON.parse(v.answers)}
  if(b.startNewEdition){if(d?.status==='Returned')fail(409,'Complete the returned attempt before starting a different case edition');answers={_curriculumEdition:getSession().curriculumEdition}}else if(!b.restore){answers._curriculumEdition=d?(JSON.parse(d.answers)._curriculumEdition||'legacy-v1'):getSession().curriculumEdition}
  const rev=Number(b.revision);if(!Number.isInteger(rev)||rev<0)fail(400,'Invalid revision');
  if((d?.revision||0)!==rev)return json({error:'A newer cloud version exists. Compare before replacing.',conflict:true,draft:d?{...d,answers:JSON.parse(d.answers)}:null},409);
  const time=now();const next=rev+1;
  const result=await q("INSERT INTO drafts VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET answers=excluded.answers,revision=excluded.revision,updated=excluded.updated WHERE drafts.revision=? AND drafts.status IN ('Draft','Returned')",draftKey(),uid,sessionId,JSON.stringify(answers),next,time,d?.status||'Draft',rev).run();
  if(!result.meta.changes)fail(409,'Another update arrived. Reload your cloud draft before saving.');
  await db.batch([q('INSERT INTO versions VALUES(?,?,?,?,?)',id(),draftKey(),next,JSON.stringify(answers),time),q('DELETE FROM versions WHERE draft=? AND id NOT IN (SELECT id FROM versions WHERE draft=? ORDER BY revision DESC LIMIT 10)',draftKey(),draftKey())]);
  return json({revision:next,updated:time,answers,sessionSnapshot:JSON.stringify(sessionForAnswers(answers))});
 }
 if(path[0]==='submit'&&req.method==='POST'){
  student();getSession();const assignment=await available();const b:any=await readJSON(req);
  if(b.integrity!==true)fail(400,'Confirm the integrity declaration');
  const d=await getDraft();if(!d||!['Draft','Returned'].includes(d.status))fail(409,'Save an editable draft before submitting');
  if(b.revision!==d.revision)fail(409,'Save your latest changes before submitting');
  const a=JSON.parse(d.answers);const s=sessionForAnswers(a);const missing=requiredAnswers(s,a);if(missing.length)return json({error:'Complete all required fields',missing},400);
  const time=now(),receipt=id();const extension=await one('SELECT due FROM extensions WHERE id=?',`${email}:${sessionId}`);const due=extension?.due||assignment?.due;const late=due&&time>due?1:0;
  const files=await all('SELECT id,filename,size,mime FROM uploads WHERE owner=? AND session=?',uid,sessionId);a._evidence=JSON.stringify(files);a._session=JSON.stringify(s);a._integrity=`Confirmed by ${email} at ${time}`;
  const result=await db.batch([q("INSERT INTO submissions SELECT ?,owner,?,?,?,session,?,?, 'Submitted',?,revision,NULL,NULL,NULL FROM drafts WHERE id=? AND revision=? AND status IN ('Draft','Returned')",receipt,email,profile.name,cohort,JSON.stringify(a),time,late,draftKey(),d.revision),q("UPDATE drafts SET status='Submitted' WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM submissions WHERE id=?)",draftKey(),d.revision,receipt)]);
  if(!result[0].meta.changes)fail(409,'The worksheet changed. Reload and try again');
  await db.batch([note(uid,`Session ${sessionId} submitted. Receipt ${receipt}. ${late?'Marked late.':''}`),log(uid,'submission',receipt)]);
  return json({receipt,created:time,late,status:'Submitted'});
 }
 if(path[0]==='upload'){
  student();getSession();await available();const d=await getDraft();if(d&&!['Draft','Returned'].includes(d.status))fail(409,'Evidence is locked with your submission');
  if(req.method!=='POST')fail(405,'Use upload');
  if(!req.headers.get('content-type')?.startsWith('multipart/form-data;'))fail(415,'Upload a multipart form');
  const form=await new Response(await bounded(req,5500000),{headers:{'Content-Type':req.headers.get('content-type')||''}}).formData();const f=form.get('file');if(!(f instanceof File))fail(400,'Choose a file');
  if(f.size>5*1024*1024||f.size===0)fail(400,'Each file must be between 1 byte and 5 MB');
  const count=await one('SELECT COUNT(*) n FROM uploads WHERE owner=? AND session=?',uid,sessionId);if(count.n>=5)fail(400,'Maximum five files per session');
  const bytes=new Uint8Array(await f.arrayBuffer());let mime='';
  if(bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47&&f.name.toLowerCase().endsWith('.png'))mime='image/png';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255&&/\.jpe?g$/i.test(f.name))mime='image/jpeg';
  if(new TextDecoder().decode(bytes.slice(0,5))==='%PDF-'&&/\.pdf$/i.test(f.name))mime='application/pdf';
  if(bytes[0]===80&&bytes[1]===75&&bytes[2]===3&&bytes[3]===4&&/\.docx$/i.test(f.name))mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if(mime.includes('wordprocessingml')){let valid=false;try{const zipped=unzipSync(bytes,{filter:(f)=>f.name==='[Content_Types].xml'&&f.originalSize<100000});const content=zipped['[Content_Types].xml'];valid=!!content&&new TextDecoder().decode(content).includes('wordprocessingml.document.main+xml')}catch{}if(!valid)fail(400,'The file is not a valid DOCX document')}
  if(!mime)fail(400,'Upload a PNG, JPEG, PDF or DOCX with a matching file signature');
  const fid=id();const filename=f.name.replace(/[^a-zA-Z0-9 ._()-]/g,'_').slice(0,160);
  await bucket.put(fid,bytes,{httpMetadata:{contentType:mime}});
  await q('INSERT INTO uploads VALUES(?,?,?,?,?,?,?)',fid,uid,sessionId,filename,mime,f.size,now()).run();
  await log(uid,'evidence_uploaded',fid).run();return json({id:fid,filename,size:f.size,mime});
 }
 if(path[0]==='file'){
  const file=await one('SELECT * FROM uploads WHERE id=?',path[1]);if(!file)fail(404,'File not found');
  if(file.owner!==uid){staff();const submission=await one('SELECT cohort,answers FROM submissions WHERE owner=? AND session=? ORDER BY created DESC LIMIT 1',file.owner,file.session);if(!submission||!mayReview(role,cohort,submission.cohort)||!JSON.parse(submission.answers)._evidence?.includes(file.id))fail(403,'You cannot access this evidence')}
  const object=await bucket.get(file.id);if(!object)fail(404,'File not found');return new Response(object.body,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="${file.filename}"`,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'}});
 }
 if(path[0]==='review'){
  staff();const s=await one('SELECT * FROM submissions WHERE id=?',path[1]);if(!s)fail(404,'Submission not found');if(!mayReview(role,cohort,s.cohort))fail(403,'This cohort is outside your assignment');
  if(req.method==='GET')return json({...s,answers:JSON.parse(s.answers),grade:s.grade?JSON.parse(s.grade):null});
  const b:any=await readJSON(req);if(!['review','grade','return'].includes(b.action))fail(400,'Invalid review action');
  if(!['Submitted','Under review'].includes(s.status))fail(409,'This attempt has already been reviewed');
  if(b.action==='grade'&&!validGrade(b.grade))fail(400,'Rubric limits are 4, 2, 2 and 2');
  if(b.action!=='review'&&(!b.feedback||String(b.feedback).trim().length<10))fail(400,'Add specific feedback of at least 10 characters');
  if(String(b.feedback||'').length>20000)fail(400,'Feedback too long');
  const grade=b.action==='grade'?JSON.stringify({...b.grade,comments:cleanAnswers(b.comments||{}),at:now()}):null;
  const status=b.action==='review'?'Under review':b.action==='grade'?'Graded':'Returned';
  const r=await q("UPDATE submissions SET status=?,grade=?,feedback=?,reviewer=? WHERE id=? AND status=?",status,grade,b.feedback||'',uid,s.id,s.status).run();if(!r.meta.changes)fail(409,'Another faculty member updated this submission');
  await db.batch([q('UPDATE drafts SET status=? WHERE owner=? AND session=? AND revision=?',status,s.owner,s.session,s.revision),note(s.owner,`Session ${s.session}: ${status}. ${b.feedback||'Faculty has started reviewing your work.'}`),log(uid,status,s.id)]);return json({status});
 }
 if(path[0]==='admin'){
  if(path[1]!=='invite')admin();else if(!['admin','faculty'].includes(role))fail(403,'Coordinator access required');const b:any=await readJSON(req);
  if(path[1]==='cohort'){
   const name=String(b.name||'').trim();if(name.length<3||name.length>100)fail(400,'Enter a cohort name (3–100 characters)');
   const cid=id();await db.batch([q('INSERT INTO cohorts VALUES(?,?,?,?)',cid,name,b.policy==='sequential'?'sequential':'open',now()),log(uid,'cohort_created',cid)]);return json({id:cid});
  }
  if(path[1]==='roster'){
   if(!Array.isArray(b.rows)||b.rows.length<1||b.rows.length>200)fail(400,'Add 1–200 roster rows');
   const statements=[];for(const r of b.rows){const em=String(r.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))fail(400,'Invalid email');if(!['student','faculty'].includes(r.role))fail(400,'Choose student or faculty');if(!await one('SELECT id FROM cohorts WHERE id=?',r.cohort))fail(400,'Unknown cohort');if(em===ownerEmail)fail(400,'The site owner role cannot be changed');if(String(r.name||'').length>100||String(r.studentId||'').length>80)fail(400,'Roster fields too long');
   const old=await one('SELECT * FROM roster WHERE email=?',em);if(old&&old.cohort!==r.cohort){const existing=await one('SELECT id FROM submissions WHERE email=? LIMIT 1',em);if(existing)fail(400,'Students with submitted work cannot be moved between cohorts')}
   statements.push(q('INSERT INTO roster VALUES(?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,role=excluded.role,cohort=excluded.cohort,studentId=excluded.studentId,consent=excluded.consent',em,r.name||em,r.role,r.cohort,r.studentId||'',r.consent===true?1:0))}
   await db.batch([...statements,log(uid,'roster_updated',String(b.rows.length))]);return json({count:b.rows.length});
  }
  if(path[1]==='assignment'){
   if(!await one('SELECT id FROM cohorts WHERE id=?',b.cohort)||!sessions.some(s=>s.id===b.session))fail(400,'Select a cohort and session');
   for(const k of ['due','unlock'])if(b[k]&&Number.isNaN(Date.parse(b[k])))fail(400,'Invalid date');
   await q('INSERT INTO assignments VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET due=excluded.due,unlock=excluded.unlock',`${b.cohort}:${b.session}`,b.cohort,b.session,b.due?new Date(b.due).toISOString():null,b.unlock?new Date(b.unlock).toISOString():null).run();await log(uid,'schedule_updated',`${b.cohort}:${b.session}`).run();return json({ok:true});
  }
  if(path[1]==='extension'){
   const em=String(b.email||'').toLowerCase();if(!await one('SELECT email FROM roster WHERE email=?',em)||!sessions.some(s=>s.id===b.session)||Number.isNaN(Date.parse(b.due)))fail(400,'Enter an enrolled student, session and valid due date');
   await q('INSERT INTO extensions VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET due=excluded.due',`${em}:${b.session}`,em,b.session,new Date(b.due).toISOString()).run();await log(uid,'extension',`${em}:${b.session}`).run();return json({ok:true});
  }
  if(path[1]==='content'){
   const s=sessions.find(s=>s.id===b.session);if(!s)fail(400,'Choose an existing session');
   const next={...s};for(const k of ['title','outcome','case','concept','example','task','squad','ai','stretch']){if(typeof b[k]==='string'){if(b[k].length>12000)fail(400,'Content field too long');(next as any)[k]=b[k]}}
   await db.batch([q('INSERT INTO content VALUES(?,?,?) ON CONFLICT(session) DO UPDATE SET body=excluded.body,updated=excluded.updated',s.id,JSON.stringify(next),now()),log(uid,'content_updated',String(s.id))]);return json({ok:true});
  }
  if(path[1]==='invite'){
   const em=String(b.email||'').trim().toLowerCase();
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))fail(400,'Invalid email address');
   const rosterEntry=await one('SELECT * FROM roster WHERE email=?',em);
   const targetRole=em===ownerEmail?'admin':rosterEntry?.role;
   const targetCohort=rosterEntry?.cohort||cohort||'cohort_alpha';
   if(!targetRole)fail(400,'User must be added to the college roster first');
   if(role==='faculty'&&rosterEntry?.cohort!==cohort)fail(403,'Faculty can only invite members of their assigned cohort');
   const {token,tokenHash}=await generateInvitationToken();
   const invId=id();
   const expiresAt=new Date(Date.now()+7*86400000).toISOString();
   await q('UPDATE invitations SET used=1 WHERE email=? AND used=0',em).run();
   await q('INSERT INTO invitations VALUES(?,?,?,?,?,?,0,?)',invId,em,tokenHash,targetRole,targetCohort,expiresAt,now()).run();
   await log(uid,'invitation_created',em).run();
   const origin=new URL(req.url).origin;
   return json({ok:true,email:em,role:targetRole,cohort:targetCohort,token,inviteUrl:`${origin}/activate?token=${token}`,expires:expiresAt});
  }
 }
 fail(404,'Not found');
}
async function handle(req:Request){try{return await run(req)}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('Workspace request failed',e instanceof Error?e.message:'Unknown error');return json({error:'The request could not be completed. Your local draft remains available.'},500)}}
export const GET=handle;export const POST=handle;
