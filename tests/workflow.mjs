import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const mfPath=path.join(process.cwd(),'node_modules/.pnpm',fs.readdirSync('node_modules/.pnpm').find(n=>n.startsWith('miniflare@')),'node_modules/miniflare/dist/src/index.js');const{Miniflare}=require(mfPath);
const mf=new Miniflare({modules:[{type:'ESModule',path:path.resolve('dist/server/index.js')},...fs.readdirSync('dist/server',{recursive:true}).filter(n=>n.endsWith('.js')&&n!=='index.js').map(n=>({type:'ESModule',path:path.resolve('dist/server',n)}))],compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'test-worklab'},r2Buckets:['BUCKET']});
try{
 const db=await mf.getD1Database('DB');const sql=fs.readFileSync('drizzle/0000_sudden_anthem.sql','utf8');for(const statement of sql.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean)){await db.prepare(statement).run()}
 const actors={admin:['qa-admin','vayentragurukula@gmail.com'],student:['qa-student','student@example.edu'],other:['qa-other','other@example.edu'],faculty:['qa-faculty','faculty@example.edu'],outsider:['qa-outsider','outsider@example.edu'],pending:['qa-pending','pending@example.edu']};
 async function call(actor,url,body,expected=200,origin='https://worklab.test'){const headers={};if(actor){headers['oai-authenticated-user-id']=actors[actor][0];headers['oai-authenticated-user-email']=actors[actor][1]}if(body!==undefined){headers['Content-Type']='application/json';headers.Origin=origin}const r=await mf.dispatchFetch('https://worklab.test/api/'+url,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body)});const text=await r.text();let data;try{data=JSON.parse(text)}catch{throw Error(`${url}: ${r.status} ${text.slice(0,300)}`)}assert.equal(r.status,expected,`${actor||'anonymous'} ${url}: ${JSON.stringify(data).slice(0,500)}`);return data}
 const page=await mf.dispatchFetch('https://worklab.test/');assert.equal(page.status,200);assert.ok((await page.text()).includes('VAYENTRA'));
 const anon=await call(null,'boot');assert.equal(anon.user,null);assert.equal(anon.sessions.length,24);
 await call(null,'draft/1',undefined,401);assert.equal((await call('pending','boot')).user.role,'pending');await call('pending','draft/1',{},403);
 const c=await call('admin','admin/cohort',{name:'QA cohort A',policy:'open'});const c2=await call('admin','admin/cohort',{name:'QA cohort B',policy:'sequential'});
 await call('admin','admin/roster',{rows:[{email:actors.student[1],name:'Student A',studentId:'A1',cohort:c.id,role:'student',consent:true},{email:actors.other[1],name:'Student B',studentId:'B1',cohort:c.id,role:'student',consent:true},{email:actors.faculty[1],name:'Faculty A',cohort:c.id,role:'faculty',consent:true},{email:actors.outsider[1],name:'Faculty B',cohort:c2.id,role:'faculty',consent:true}]});
 await call('student','admin/cohort',{name:'Invalid',policy:'open'},403);await call('admin','admin/cohort',{name:'Bad origin'},403,'https://evil.test');
 const s=anon.sessions[0];const answers={contribution:'My calculations and handoff review',aiUse:'No AI used',reflection:'I will check source records more carefully'};s.blocks.forEach((b,i)=>{if(b.type==='text')answers['b'+i]='Evidence-based answer '+i;else b.rows.forEach((r,ri)=>r.forEach((c,ci)=>{if(c==='')answers[`b${i}r${ri}c${ci}`]='Test working'}))});
 let d=await call('student','draft/1',{answers,revision:0});assert.equal(d.revision,1);
 await call('student','draft/1',{answers,revision:0},409);
 assert.equal((await call('other','draft/1')).draft.revision,0);
 await call('student','submit/1',{revision:1,integrity:false},400);
 await call('admin','admin/assignment',{cohort:c.id,session:1,due:'2020-01-01T00:00:00Z',unlock:null});
 const uploadForm=new FormData();uploadForm.set('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/hN8AAAAASUVORK5CYII=','base64')],'evidence.png',{type:'image/png'}));
 const encodedForm=new Response(uploadForm);const uploadBytes=new Uint8Array(await encodedForm.arrayBuffer());
 const upload=await mf.dispatchFetch('https://worklab.test/api/upload/1',{method:'POST',headers:{'oai-authenticated-user-id':actors.student[0],'oai-authenticated-user-email':actors.student[1],Origin:'https://worklab.test','Content-Type':encodedForm.headers.get('content-type')},body:uploadBytes});assert.equal(upload.status,200);const file=await upload.json();
 await call('other','file/'+file.id,undefined,403);await call('faculty','file/'+file.id,undefined,403);await call(null,'file/'+file.id,undefined,401);
 const sub=await call('student','submit/1',{revision:1,integrity:true});assert.equal(sub.late,1);assert.ok(sub.receipt);
 await call('student','draft/1',{answers,revision:1},409);await call('student','submit/1',{revision:1,integrity:true},409);
 await call('student','review/'+sub.receipt,undefined,403);await call('outsider','review/'+sub.receipt,undefined,403);
 const ownedFile=await mf.dispatchFetch('https://worklab.test/api/file/'+file.id,{headers:{'oai-authenticated-user-id':actors.faculty[0],'oai-authenticated-user-email':actors.faculty[1]}});assert.equal(ownedFile.status,200);assert.ok(ownedFile.headers.get('Content-Disposition').includes('attachment'));assert.equal((await ownedFile.arrayBuffer()).byteLength,68);
 await call('outsider','file/'+file.id,undefined,403);
 let review=await call('faculty','review/'+sub.receipt);assert.equal(review.answers.contribution,answers.contribution);
 await call('faculty','review/'+sub.receipt,{action:'review'});await call('faculty','review/'+sub.receipt,{action:'grade',grade:{execution:5,reasoning:2,communication:2,process:2},feedback:'Too high score'},400);
 await call('faculty','review/'+sub.receipt,{action:'return',feedback:'Explain the payment reserve test and your source checks.'});
 d=await call('student','draft/1',{answers:{...answers,reflection:'Revised after feedback'},revision:1});
 await call('admin','admin/extension',{email:actors.student[1],session:1,due:'2099-01-01T00:00:00Z'});
 const sub2=await call('student','submit/1',{revision:d.revision,integrity:true});assert.equal(sub2.late,0);
 await call('faculty','review/'+sub2.receipt,{action:'grade',grade:{execution:3,reasoning:2,communication:1.5,process:2},comments:{b2:'Clear calculation'},feedback:'Good revision. Explain the reserve policy more concisely.'});
 const student=await call('student','boot');assert.equal(student.submissions.length,2);assert.equal(student.submissions[0].status,'Graded');assert.equal(JSON.parse(student.submissions[0].grade).execution,3);
 assert.equal((await call('other','boot')).submissions.length,0);assert.equal((await call('outsider','boot')).queue.length,0);
 await call('admin','admin/assignment',{cohort:c.id,session:2,unlock:'2099-01-01T00:00:00Z'});await call('student','draft/2',undefined,403);
 for(let revision=0;revision<12;revision++)await call('student','draft/3',{answers:{contribution:'Version '+revision},revision});
 const versioned=await call('student','draft/3');assert.equal(versioned.versions.length,10);
 const restored=await call('student','draft/3',{revision:12,restore:versioned.versions[9].id});assert.equal(restored.revision,13);
 await call('other','draft/3',{revision:0,restore:versioned.versions[0].id},404);
 await call('admin','admin/content',{session:1,case:'Updated fictional case for curriculum testing.'});assert.equal((await call(null,'boot')).sessions[0].case,'Updated fictional case for curriculum testing.');assert.equal((await call('faculty','review/'+sub.receipt)).answers.contribution,answers.contribution);assert.equal(JSON.parse((await call('faculty','review/'+sub.receipt)).answers._session).case,s.case);
 const legacy=JSON.parse(fs.readFileSync('lib/legacy-sessions.json','utf8'))[3];const legacyAnswers={b0r0c0:'Earlier saved answer',contribution:'Earlier version'};await db.prepare('INSERT INTO drafts VALUES(?,?,?,?,?,?,?)').bind('qa-other:4','qa-other',4,JSON.stringify(legacyAnswers),1,new Date().toISOString(),'Draft').run();await db.prepare('INSERT INTO versions VALUES(?,?,?,?,?)').bind('old-version','qa-other:4',1,JSON.stringify(legacyAnswers),new Date().toISOString()).run();
 const oldDraft=await call('other','draft/4');assert.equal(JSON.parse(oldDraft.sessionSnapshot).case,legacy.case);const switched=await call('other','draft/4',{revision:1,startNewEdition:true});assert.equal(switched.revision,2);assert.equal(switched.answers._curriculumEdition,'india-cases-2026-09-30');assert.equal(switched.answers.b0r0c0,undefined);const recover=await call('other','draft/4',{revision:2,restore:'old-version'});assert.equal(JSON.parse(recover.sessionSnapshot).case,legacy.case);assert.equal(recover.answers.b0r0c0,'Earlier saved answer');
 const template=await mf.dispatchFetch('https://worklab.test/api/template/1');assert.equal(template.status,200);assert.ok(template.headers.get('content-type').includes('wordprocessingml'));const packageBytes=new Uint8Array(await template.arrayBuffer());assert.equal(packageBytes[0],80);assert.equal(packageBytes[1],75);
 const zip=await mf.dispatchFetch('https://worklab.test/api/template/all');assert.equal(zip.status,200);const{unzipSync}=await import('fflate');const parts=unzipSync(new Uint8Array(await zip.arrayBuffer()));assert.equal(Object.keys(parts).length,24);const templateParts=unzipSync(parts['S01_Student_Worksheet.docx']);const templateText=new TextDecoder().decode(templateParts['word/document.xml']);assert.ok(templateText.includes('classroom dataset'));assert.ok(templateText.includes('Surprise card'));
 for(const session of anon.sessions){assert.ok(session.case.split(/\s+/).length>=140);assert.equal(session.sources.length,3);assert.equal(session.blocks.length,2);assert.equal(session.blocks[0].rows.length,3);assert.ok(session.activityMinutes>=10&&session.activityMinutes<=15);assert.equal(session.lab.roles.length,4);assert.equal(session.lab.rounds.length,5);assert.ok(session.companySource.url.startsWith('https://'));}
 console.log('PASS: anonymous access, enrolment, RBAC/cohort isolation, CSRF, cloud CAS, required integrity, late/extension flags, immutable attempts, return/resubmit/grade, notifications, release locks, 10-version retention, ownership, private evidence upload/download, immutable case snapshots, CMS, server rendering, legacy-draft edition switch/restore, 24 refreshed case structures, current Word and ZIP exports');
}finally{await mf.dispose()}
