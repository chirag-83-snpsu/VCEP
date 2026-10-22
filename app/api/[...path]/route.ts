import {env} from 'cloudflare:workers';
import {unzipSync} from 'fflate';
import baseSessions from '@/lib/sessions.json';
import legacySessions from '@/lib/legacy-sessions.json';
import {exportWork} from '@/lib/export-work';
import {zipSync} from 'fflate';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {cleanAnswers,requiredAnswers,validGrade,mayReview} from '@/lib/rules';
const ownerEmail='vayentragurukula@gmail.com';
const now=()=>new Date().toISOString();
const id=()=>crypto.randomUUID();
class HttpError extends Error{constructor(public status:number,msg:string){super(msg)}}
function fail(status:number,msg:string):never{throw new HttpError(status,msg)}
async function bounded(req:Request,max:number){const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>max){await reader.cancel();fail(413,'Request exceeds its size limit')}chunks.push(r.value)}const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return bytes}
async function readJSON(req:Request){try{return JSON.parse(new TextDecoder().decode(await bounded(req,250000)))}catch(e){if(e instanceof HttpError)throw e;fail(400,'Invalid JSON request')}}
const json=(o:any,status=200)=>Response.json(o,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function run(req:Request){
 const path=new URL(req.url).pathname.slice(5).split('/');
 const db=(env as any).DB as D1Database;const bucket=(env as any).BUCKET as R2Bucket;
 if(!db)fail(503,'The learning workspace is being configured. Downloadable worksheets remain available.');
 const q=(s:string,...v:any[])=>db.prepare(s).bind(...v);
 const all=async(s:string,...v:any[])=>(await q(s,...v).all()).results as any[];
 const one=async(s:string,...v:any[])=>await q(s,...v).first<any>();
 const log=(actor:string,event:string,target:string)=>q('INSERT INTO audit VALUES(?,?,?,?,?)',id(),actor,event,target,now());
 const note=(owner:string,message:string)=>q('INSERT INTO notifications VALUES(?,?,?,?,0)',id(),owner,message,now());
 const auth=await getChatGPTUser();
 if(req.method!=='GET'){
  if(req.headers.get('origin')!==new URL(req.url).origin)fail(403,'Request origin rejected');
  if(Number(req.headers.get('content-length')||0)>5500000)fail(413,'File or request is too large');
 }
 const sessionData=async()=>{const overrides=await all('SELECT * FROM content');return baseSessions.map(s=>{const o=overrides.find(o=>o.session===s.id);return o&&JSON.parse(o.body).curriculumEdition===s.curriculumEdition?JSON.parse(o.body):s})};
 if(path[0]==='template'&&req.method==='GET'){const ss=await sessionData();if(path[1]==='all'){const entries:Record<string,Uint8Array>={};for(const s of ss)entries[`S${String(s.id).padStart(2,'0')}_Student_Worksheet.docx`]=new Uint8Array(await (await exportWork(s,{},'Student name ____________________')).arrayBuffer());return new Response(new Uint8Array(zipSync(entries)),{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="VCEP_24_India_Case_Worksheets.zip"'}})}const s=ss.find(v=>v.id===Number(path[1]));if(!s)fail(404,'Session not found');return new Response(await exportWork(s,{},'Student name ____________________'),{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','Content-Disposition':`attachment; filename="VCEP_S${String(s.id).padStart(2,'0')}_Worksheet.docx"`}})}
 if(!auth){if(path[0]==='boot')return json({user:null,sessions:await sessionData()});fail(401,'Sign in to continue')}
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
  const [cohorts,roster,queue,assignments,notifications]=await Promise.all([role==='admin'?all('SELECT * FROM cohorts'):all('SELECT * FROM cohorts WHERE id=?',cohort),role==='admin'?all('SELECT * FROM roster'):all('SELECT * FROM roster WHERE cohort=?',cohort),role==='admin'?all('SELECT id,owner,email,name,cohort,session,created,status,late,grade,feedback FROM submissions ORDER BY created DESC LIMIT 2000'):all('SELECT id,owner,email,name,cohort,session,created,status,late,grade,feedback FROM submissions WHERE cohort=? ORDER BY created DESC LIMIT 2000',cohort),role==='admin'?all('SELECT * FROM assignments'):all('SELECT * FROM assignments WHERE cohort=?',cohort),all('SELECT * FROM notifications WHERE owner=? ORDER BY created DESC LIMIT 50',uid)]);
  return json({user:profile,sessions,cohorts,roster,queue,assignments,notifications});
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
  admin();const b:any=await readJSON(req);
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
 }
 fail(404,'Not found');
}
async function handle(req:Request){try{return await run(req)}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('Workspace request failed',e instanceof Error?e.message:'Unknown error');return json({error:'The request could not be completed. Your local draft remains available.'},500)}}
export const GET=handle;export const POST=handle;
