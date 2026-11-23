'use client';
import {useState} from 'react';import {Button} from '@/components/ui/button';import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';import {Checkbox} from '@/components/ui/checkbox';import {toast} from 'sonner';import {api,Choice,DataTable,NoteField,exportCSV} from './components';import {totalGrade} from '@/lib/rules';
import FacultyChartView from './three/faculty-chart-view';
import SessionIcon from '@/components/session-icon';
import { Copy, Check, KeyRound, Send, RefreshCw } from 'lucide-react';
export default function Staff({boot:b,onRefresh}:any){
 const[cohort,setCohort]=useState('all'),[filter,setFilter]=useState('all'),[session,setSession]=useState('all'),[review,setReview]=useState<any>(null),[grade,setGrade]=useState<any>({execution:0,reasoning:0,communication:0,process:0}),[feedback,setFeedback]=useState(''),[comments,setComments]=useState<any>({}),[busy,setBusy]=useState(false),[analyticsMode,setAnalyticsMode]=useState<'table'|'3d'>('3d');
 const admin=b.user.role==='admin';const queue=b.queue||[];const visible=queue.filter((q:any)=>(cohort==='all'||q.cohort===cohort)&&(filter==='all'||q.status===filter)&&(session==='all'||q.session===Number(session)));
 const cohortItems=[{value:'all',label:'All cohorts'},...b.cohorts.map((c:any)=>({value:c.id,label:c.name}))];
 const sessionItems=[{value:'all',label:'All sessions'},...b.sessions.map((s:any)=>({value:s.id,label:`${s.id}. ${s.title}`}))];
 const latest=queue.filter((q:any,i:number)=>queue.findIndex((p:any)=>p.owner===q.owner&&p.session===q.session)===i);
 const graded=latest.filter((q:any)=>q.grade);const enrolled=b.roster.filter((r:any)=>r.role==='student').length;
 async function open(q:any){try{const d=await api('review/'+q.id);setReview(d);setGrade(d.grade||{execution:0,reasoning:0,communication:0,process:0});setComments(d.grade?.comments||{});setFeedback(d.feedback||'')}catch(e:any){toast.error(e.message)}}
 async function act(action:string){setBusy(true);try{await api('review/'+review.id,{action,grade,comments,feedback});toast.success(action==='grade'?'Grade published':action==='return'?'Returned for revision':'Review started');if(action==='review')setReview({...review,status:'Under review'});else setReview(null);await onRefresh()}catch(e:any){toast.error(e.message)}finally{setBusy(false)}}
 const selectedSession=review?.answers?._session?JSON.parse(review.answers._session):b.sessions.find((s:any)=>s.id===review?.session);
 return <><section className="dashboard-intro"><div><p className="eyebrow">{admin?'PROGRAMME CONTROL':'FACULTY WORKSPACE'}</p><h1>{admin?'Make every session count.':'Review the work. Guide the next step.'}</h1><p>Manage the learning journey through visible evidence and specific feedback.</p></div><Button variant="outline" onClick={onRefresh}>Refresh workspace</Button></section><div className="metrics"><section><strong>{enrolled}</strong><span>Enrolled students</span></section><section><strong>{queue.filter((q:any)=>['Submitted','Under review'].includes(q.status)).length}</strong><span>Awaiting review</span></section><section><strong>{enrolled?Math.round(latest.filter((q:any)=>q.status!=='Returned').length/(enrolled*24)*100):0}%</strong><span>Session submission coverage</span></section><section><strong>{graded.length?(graded.reduce((n:number,g:any)=>n+totalGrade(JSON.parse(g.grade)),0)/graded.length).toFixed(1):'—'}</strong><span>Mean graded session / 10</span></section></div>
 <Tabs defaultValue="queue"><TabsList><TabsTrigger value="queue">Review queue</TabsTrigger><TabsTrigger value="analytics">Cohort progress</TabsTrigger><TabsTrigger value="roster">Roster & Invitations</TabsTrigger>{admin&&<TabsTrigger value="admin">College setup</TabsTrigger>}{admin&&<TabsTrigger value="content">Session content</TabsTrigger>}<TabsTrigger value="readiness">Rollout checklist</TabsTrigger></TabsList>
 <TabsContent value="queue"><section className="paper"><div className="section-head"><div><h2>Submission review</h2><p className="muted">Each row is an immutable student attempt. Grade only after checking its evidence.</p></div><Button variant="outline" onClick={()=>exportCSV([['Student','Email','Cohort','Session','Submitted','Status','Late','Execution /4','Reasoning /2','Communication /2','Process /2','Total /10'],...visible.map((q:any)=>{const g=q.grade?JSON.parse(q.grade):{};return[q.name,q.email,b.cohorts.find((c:any)=>c.id===q.cohort)?.name,q.session,q.created,q.status,q.late?'Yes':'No',g.execution,g.reasoning,g.communication,g.process,q.grade?totalGrade(g):'']})])}>Export filtered CSV</Button></div><div className="filters"><Choice label="Cohort" value={cohort} onChange={setCohort} items={cohortItems}/><Choice label="Session" value={session} onChange={setSession} items={sessionItems}/><Choice label="Status" value={filter} onChange={setFilter} items={['all','Submitted','Under review','Graded','Returned'].map(v=>({value:v,label:v==='all'?'All statuses':v}))}/></div>{visible.length?<DataTable heads={['Student','Session','Submitted','Status','Marks','Action']} rows={visible.map((q:any)=>[<><b>{q.name}</b><small className="block-text">{q.email}</small></>,<span className="inline-flex items-center gap-1.5"><SessionIcon session={q.session} size="sm" withContainer={false} /> {String(q.session).padStart(2,'0')}</span>,<>{new Date(q.created).toLocaleString()}{q.late?' • Late':''}</>,<span className="status">{q.status}</span>,q.grade?totalGrade(JSON.parse(q.grade))+'/10':'—',<Button variant="outline" size="sm" onClick={()=>open(q)}>Review</Button>])}/>:<div className="empty-state"><h3>No submissions in this view</h3><p>Student work will appear here after a confirmed submission.</p></div>}</section></TabsContent>
 <TabsContent value="analytics"><section className="paper"><div className="section-head"><div><h2>Progress across all 24 sessions</h2><p className="muted">Counts use each student’s latest attempt. Missing submissions are visible; they are not automatically recorded as zero marks.</p></div><div className="inline-flex rounded-lg border border-[#c2ceca] p-1 bg-[#f5f6f1]"><Button size="sm" variant={analyticsMode==='3d'?'default':'ghost'} className="h-8 text-xs font-semibold" onClick={()=>setAnalyticsMode('3d')}>3D Landscape</Button><Button size="sm" variant={analyticsMode==='table'?'default':'ghost'} className="h-8 text-xs font-semibold" onClick={()=>setAnalyticsMode('table')}>2D Table</Button></div></div>{analyticsMode==='3d'&&<FacultyChartView metrics={b.sessions.map((s:any)=>{const qs=latest.filter((q:any)=>q.session===s.id),gs=qs.filter((q:any)=>q.grade);return{sessionId:s.id,title:s.title,submittedCount:qs.filter((q:any)=>q.status!=='Returned').length,meanScore:gs.length?(gs.reduce((n:number,q:any)=>n+totalGrade(JSON.parse(q.grade)),0)/gs.length):0}})}/>}<DataTable heads={['Session','Submitted / reviewed','Graded','Returned','Mean /10']} rows={b.sessions.map((s:any)=>{const qs=latest.filter((q:any)=>q.session===s.id),gs=qs.filter((q:any)=>q.grade);return[`${s.id}. ${s.title}`,qs.filter((q:any)=>q.status!=='Returned').length,gs.length,qs.filter((q:any)=>q.status==='Returned').length,gs.length?(gs.reduce((n:number,q:any)=>n+totalGrade(JSON.parse(q.grade)),0)/gs.length).toFixed(1):'—']})}/><h3>Student evidence coverage</h3><DataTable heads={['Student','Cohort','Submitted /24','Graded /24']} rows={b.roster.filter((r:any)=>r.role==='student').map((r:any)=>[r.name,b.cohorts.find((c:any)=>c.id===r.cohort)?.name,latest.filter((q:any)=>q.email===r.email&&q.status!=='Returned').length,latest.filter((q:any)=>q.email===r.email&&q.grade).length])}/></section></TabsContent>
 <TabsContent value="roster"><RosterManager boot={b} onRefresh={onRefresh}/></TabsContent>
 {admin&&<TabsContent value="admin"><Admin boot={b} onRefresh={onRefresh}/></TabsContent>}{admin&&<TabsContent value="content"><ContentEditor boot={b} onRefresh={onRefresh}/></TabsContent>}
 <TabsContent value="readiness"><section className="paper"><h2>Before the first college cohort</h2><p>The core workspace uses ChatGPT sign-in, college roster access, cloud storage and in-app updates. It is a pilot build; institutional production requirements below still need completion.</p><DataTable heads={['Requirement','Current position','Next action']} rows={[
 ['College sign-in','ChatGPT sign-in + approved email roster','School Google Workspace SSO / student-password fallback requires a supported institution identity integration.'],
 ['Participation consent','Administrator confirms consent in roster','College must obtain and retain appropriate permissions, including parent/guardian permission where required. No identity documents should be uploaded.'],
 ['Evidence safety','Private downloads; 5 MB and file-signature checks','Connect malware scanning and quarantine before accepting untrusted uploads at scale.'],
 ['Notifications','In-app receipt and feedback updates; dashboard deadlines','Connect an approved email provider and scheduled reminder service. No email delivery is claimed.'],
 ['Operational assurance','Audit events recorded in cloud data','Configure and verify backup retention, restore drills, deletion requests, monitoring and service ownership.'],
 ['Performance and security','Build and access-rule checks','Run institution UAT, independent security review, 2,000-user load test, accessibility and real-device 3D tests.'],
 ['Assessment','Session rubric: 4 + 2 + 2 + 2','Final credential needs attendance, sprint evidence, independent assessment and approved moderation. A mean session score is not certification.'],
 ['3D production assets','Optional lightweight procedural scenes','GLB/Draco/KTX2 authoring pipeline, managed asset registry and device-budget validation are later production work.']
 ]}/></section></TabsContent></Tabs>
 <Dialog open={!!review} onOpenChange={v=>!v&&setReview(null)}><DialogContent className="review-dialog"><DialogHeader><DialogTitle className="flex items-center gap-2"><SessionIcon session={review?.session||1} size="sm" /><span>Session {review?.session} · {review?.name}</span></DialogTitle><DialogDescription>{review?.status} · Receipt {review?.id}</DialogDescription></DialogHeader>{review&&<div><div className="review-work"><h3>{selectedSession?.title}</h3><p>{selectedSession?.case}</p><details><summary>Review the case source tables</summary><p>{selectedSession?.dataNote}</p>{selectedSession?.companySource&&<a href={selectedSession.companySource.url} target="_blank" rel="noreferrer">Official company source ↗</a>}{selectedSession?.sources.map((r:any,i:number)=><section key={i}><h3>{r.title}</h3><p>{r.description}</p><DataTable heads={r.heads} rows={r.rows}/></section>)}</details>{selectedSession?.blocks.map((block:any,i:number)=><section key={i} className="block"><h3>{block.title}</h3>{block.type==='text'?<p className="preserve">{review.answers['b'+i]||'No answer'}</p>:<DataTable heads={block.heads} rows={block.rows.map((r:any[],ri:number)=>r.map((c:any,ci:number)=>c||review.answers[`b${i}r${ri}c${ci}`]||'—'))}/>}<label className="field-label">Feedback on this section<textarea disabled={['Graded','Returned'].includes(review.status)} rows={2} value={comments['b'+i]||''} onChange={e=>setComments({...comments,['b'+i]:e.target.value})}/></label></section>)}{['contribution','squadDecision','aiUse','aiInputs','aiOutput','aiChecks','aiReview','practiceWork','practiceEvidence','evidence','reflection'].filter(k=>review.answers[k]).map(k=><p className="preserve" key={k}><b>{k}: </b>{review.answers[k]}</p>)}<h3>Attached evidence</h3>{JSON.parse(review.answers._evidence||'[]').map((f:any)=><p key={f.id}><a href={'/api/file/'+f.id}>{f.filename} ↗</a></p>)}<p className="muted">Evidence files have not been automatically scanned. Review using your institution’s secure document environment.</p></div><h3>Assessment rubric</h3><div className="rubric-inputs">{[['execution',4],['reasoning',2],['communication',2],['process',2]].map(([k,max])=><label className="field-label" key={k}>{k} / {max}<input type="number" step="0.5" min="0" max={max} value={grade[String(k)]} disabled={['Graded','Returned'].includes(review.status)} onChange={e=>setGrade({...grade,[k]:Number(e.target.value)})}/></label>)}</div><p><b>Total: {totalGrade(grade)}/10</b></p><NoteField title="Overall feedback and next action" value={feedback} onChange={setFeedback} disabled={['Graded','Returned'].includes(review.status)}/>{!['Graded','Returned'].includes(review.status)&&<div className="action-row"><Button variant="outline" disabled={busy||review.status==='Under review'} onClick={()=>act('review')}>Start review</Button><Button variant="outline" disabled={busy||feedback.trim().length<10} onClick={()=>act('return')}>Return for revision</Button><Button disabled={busy||feedback.trim().length<10} onClick={()=>act('grade')}>Publish grade & feedback</Button></div>}</div>}</DialogContent></Dialog>
 </>
}
function Admin({boot:b,onRefresh}:any){const[name,setName]=useState(''),[policy,setPolicy]=useState('open'),[selected,setSelected]=useState(b.cohorts[0]?.id||''),[rows,setRows]=useState(''),[role,setRole]=useState('student'),[consent,setConsent]=useState(false),[sid,setSid]=useState('1'),[due,setDue]=useState(''),[unlock,setUnlock]=useState(''),[email,setEmail]=useState(''),[busy,setBusy]=useState(false);
 async function submit(path:string,data:any){setBusy(true);try{const d=await api('admin/'+path,data);toast.success('Saved');await onRefresh();return d}catch(e:any){toast.error(e.message)}finally{setBusy(false)}}
 const cohorts=b.cohorts.map((c:any)=>({value:c.id,label:c.name}));return <div className="admin-grid"><section className="paper"><p className="eyebrow">01 / COHORT</p><h2>Create a college batch</h2><label className="field-label">Cohort name<input value={name} placeholder="College · B.Com · October 2026" onChange={e=>setName(e.target.value)}/></label><Choice label="Session progression" value={policy} onChange={setPolicy} items={[{value:'open',label:'Open all sessions (subject to release dates)'},{value:'sequential',label:'Submit the previous session to continue'}]}/><Button disabled={busy||name.trim().length<3} onClick={async()=>{const d=await submit('cohort',{name,policy});if(d){setName('');setSelected(d.id)}}}>Create cohort</Button><p className="muted">Dates are configured separately. This programme has no fixed weekend timetable.</p></section>
 <section className="paper"><p className="eyebrow">02 / PEOPLE</p><h2>Enrol students and faculty</h2><Choice label="Cohort" value={selected} onChange={setSelected} items={cohorts}/><Choice label="Role" value={role} onChange={setRole} items={[{value:'student',label:'Student'},{value:'faculty',label:'Faculty — this cohort only'}]}/><label className="field-label">One person per line: email, name, student ID<textarea rows={5} value={rows} onChange={e=>setRows(e.target.value)} placeholder="student@college.edu, Student Name, BCOM001"/></label><label className="check-label"><Checkbox checked={consent} onCheckedChange={v=>setConsent(v===true)}/><span>The college has recorded the required participation permissions, including guardian permission where applicable. Students without this confirmation cannot save work.</span></label><Button disabled={busy||!selected||!rows.trim()} onClick={async()=>{const parsed=rows.trim().split('\n').map(l=>{const[email,name,studentId]=l.split(',').map(v=>v.trim());return{email,name,studentId,role,cohort:selected,consent}});const d=await submit('roster',{rows:parsed});if(d)setRows('')}}>Save roster</Button><p className="muted">Use the email each person will use for sign-in. Re-enter a row to update its name or permissions. Faculty is scoped to one cohort in this pilot.</p></section>
 <section className="paper"><p className="eyebrow">03 / TIMETABLE</p><h2>Set release dates and deadlines</h2><Choice label="Cohort" value={selected} onChange={setSelected} items={cohorts}/><Choice label="Session" value={sid} onChange={setSid} items={b.sessions.map((s:any)=>({value:s.id,label:`Session ${s.id} · ${s.title}`}))}/><label className="field-label">Release date and time (your local timezone)<input type="datetime-local" value={unlock} onChange={e=>setUnlock(e.target.value)}/></label><label className="field-label">Submission deadline (your local timezone)<input type="datetime-local" value={due} onChange={e=>setDue(e.target.value)}/></label><Button disabled={busy||!selected} onClick={()=>submit('assignment',{cohort:selected,session:Number(sid),due:due?new Date(due).toISOString():null,unlock:unlock?new Date(unlock).toISOString():null})}>Save session schedule</Button><p className="muted">Blank dates remove that date restriction. Late submissions are accepted and clearly marked.</p><label className="field-label">Individual extension: student email<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><Button variant="outline" disabled={busy||!due||!email} onClick={()=>submit('extension',{email,session:Number(sid),due:new Date(due).toISOString()})}>Grant selected deadline to this student</Button></section>
 <section className="paper"><p className="eyebrow">04 / CURRENT ROSTER</p><h2>People and access</h2><DataTable heads={['Person','Role','Cohort','Consent']} rows={b.roster.map((r:any)=>[<>{r.name}<small className="block-text">{r.email}</small></>,r.role,b.cohorts.find((c:any)=>c.id===r.cohort)?.name,r.consent?'Confirmed':'Pending'])}/></section><section className="paper full"><h2>Published timetable</h2><DataTable heads={['Cohort','Session','Opens','Due']} rows={b.assignments.map((a:any)=>[b.cohorts.find((c:any)=>c.id===a.cohort)?.name,a.session,a.unlock?new Date(a.unlock).toLocaleString():'Open',a.due?new Date(a.due).toLocaleString():'Not set'])}/></section></div>
}
function ContentEditor({boot:b,onRefresh}:any){const[sid,setSid]=useState('1'),[edit,setEdit]=useState<any>(b.sessions[0]),[busy,setBusy]=useState(false);return <section className="paper"><h2>Session content editor</h2><p>Edits update the online learning brief. Student submissions retain their answer snapshot. Downloadable Word packs are a separate edition and must be regenerated when the brief changes.</p><Choice label="Session" value={sid} onChange={(v:string)=>{setSid(v);setEdit(b.sessions.find((s:any)=>s.id===Number(v)))}} items={b.sessions.map((s:any)=>({value:s.id,label:`${s.id}. ${s.title}`}))}/>{['title','outcome','case','concept','example','task','squad','ai','stretch'].map(k=><NoteField key={k} title={k} value={edit[k]||''} onChange={(v:string)=>setEdit({...edit,[k]:v})}/>)}<Button disabled={busy} onClick={async()=>{setBusy(true);try{await api('admin/content',{...edit,session:Number(sid)});toast.success('Session brief updated');await onRefresh()}catch(e:any){toast.error(e.message)}finally{setBusy(false)}}}>Publish session brief</Button><p className="muted">Worksheet table structure and source datasets remain controlled curriculum assets in this release. Editing an assessment after students start should be reviewed by the programme lead.</p></section>}

function RosterManager({boot:b,onRefresh}:any){
  const[selectedCohort,setSelectedCohort]=useState('all');
  const[statusFilter,setStatusFilter]=useState('all');
  const[search,setSearch]=useState('');
  const[targetEmail,setTargetEmail]=useState('');
  const[busyEmail,setBusyEmail]=useState<string|null>(null);
  const[copied,setCopied]=useState(false);
  const[activeInvite,setActiveInvite]=useState<{email:string;role:string;cohort:string;token:string;inviteUrl:string;expires:string}|null>(null);

  const roster:any[]=b.roster||[];
  const cohorts:any[]=b.cohorts||[];
  const activatedCount=roster.filter(r=>r.activated===1).length;
  const pendingCount=roster.filter(r=>r.activated!==1&&(r.pending_invites>0)).length;
  const uninvitedCount=roster.filter(r=>r.activated!==1&&!(r.pending_invites>0)).length;

  const cohortChoices=[{value:'all',label:'All cohorts'},...cohorts.map((c:any)=>({value:c.id,label:c.name}))];
  const statusChoices=[
    {value:'all',label:'All account statuses'},
    {value:'activated',label:'Activated (Password set)'},
    {value:'pending',label:'Invited (Awaiting activation)'},
    {value:'uninvited',label:'Awaiting invitation'}
  ];

  const visibleRoster=roster.filter(r=>{
    if(selectedCohort!=='all'&&r.cohort!==selectedCohort)return false;
    if(statusFilter==='activated'&&r.activated!==1)return false;
    if(statusFilter==='pending'&&(r.activated===1||!(r.pending_invites>0)))return false;
    if(statusFilter==='uninvited'&&(r.activated===1||r.pending_invites>0))return false;
    if(search.trim()){
      const q=search.toLowerCase();
      const matchName=String(r.name||'').toLowerCase().includes(q);
      const matchEmail=String(r.email||'').toLowerCase().includes(q);
      const matchId=String(r.studentId||'').toLowerCase().includes(q);
      if(!matchName&&!matchEmail&&!matchId)return false;
    }
    return true;
  });

  async function issueInvite(email:string){
    setBusyEmail(email);
    try{
      const d=await api('admin/invite',{email});
      setActiveInvite(d);
      setCopied(false);
      toast.success(`Single-use invitation generated for ${email}`);
      await onRefresh();
    }catch(err:any){
      toast.error(err.message||'Could not generate invitation');
    }finally{
      setBusyEmail(null);
    }
  }

  async function copyLink(url:string){
    try{
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Activation URL copied to clipboard');
      setTimeout(()=>setCopied(false),2500);
    }catch{
      toast.error('Could not copy link automatically');
    }
  }

  return (
    <section className="paper">
      <div className="section-head">
        <div>
          <p className="eyebrow">ACADEMIC ENROLMENT & ACCESS CONTROL</p>
          <h2>Roster & Account Invitations</h2>
          <p className="muted">
            Issue cryptographically verified, single-use activation tokens to enrolled students and faculty. Self-registration is strictly barred.
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} className="flex items-center gap-1.5">
          <RefreshCw size={14}/> Refresh Roster
        </Button>
      </div>

      <div className="metrics" style={{marginTop:18,marginBottom:24}}>
        <section>
          <strong>{roster.length}</strong>
          <span>Total roster members</span>
        </section>
        <section>
          <strong style={{color:'#0f766e'}}>{activatedCount}</strong>
          <span>Activated accounts</span>
        </section>
        <section>
          <strong style={{color:'#d97706'}}>{pendingCount}</strong>
          <span>Invited (Pending)</span>
        </section>
        <section>
          <strong style={{color:'#64748b'}}>{uninvitedCount}</strong>
          <span>Awaiting invite</span>
        </section>
      </div>

      {activeInvite && (
        <div
          style={{
            backgroundColor:'#f0fdfa',
            border:'1.5px solid #0f766e',
            borderRadius:10,
            padding:'18px 20px',
            marginBottom:24,
            boxShadow:'0 4px 12px rgba(15,118,110,0.1)'
          }}
        >
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <KeyRound size={18} style={{color:'#0f766e'}}/>
                <h3 style={{margin:0,fontSize:16,fontWeight:700,color:'#0f766e'}}>
                  Active Invitation Token for {activeInvite.email}
                </h3>
              </div>
              <p style={{margin:'6px 0 0',fontSize:13,color:'#134e4a'}}>
                Role: <b>{activeInvite.role}</b> · Cohort: <b>{cohorts.find(c=>c.id===activeInvite.cohort)?.name||activeInvite.cohort}</b> · Expires: {new Date(activeInvite.expires).toLocaleDateString()}
              </p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Button
                size="sm"
                onClick={()=>copyLink(activeInvite.inviteUrl)}
                style={{backgroundColor:'#0f766e',color:'#ffffff',gap:6}}
              >
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                {copied ? 'Copied Link!' : 'Copy Activation Link'}
              </Button>
              <Button size="sm" variant="ghost" onClick={()=>setActiveInvite(null)}>
                Dismiss
              </Button>
            </div>
          </div>

          <div style={{marginTop:12}}>
            <label style={{fontSize:12,fontWeight:600,color:'#134e4a',display:'block',marginBottom:4}}>
              Single-use activation link:
            </label>
            <input
              readOnly
              value={activeInvite.inviteUrl}
              onFocus={e=>e.target.select()}
              style={{
                width:'100%',
                padding:'8px 12px',
                fontSize:13,
                fontFamily:'monospace',
                background:'#ffffff',
                border:'1px solid #99f6e4',
                borderRadius:6,
                color:'#0f766e'
              }}
            />
          </div>
          <div style={{marginTop:8,fontSize:11,color:'#0f766e',display:'flex',alignItems:'center',gap:6}}>
            <span>Token: <code>{activeInvite.token}</code> (SHA-256 edge verified upon activation)</span>
          </div>
        </div>
      )}

      <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:8,padding:'16px 18px',marginBottom:24}}>
        <h3 style={{margin:'0 0 8px',fontSize:14,fontWeight:700,color:'#14243b'}}>Issue New Invitation</h3>
        <p style={{margin:'0 0 12px',fontSize:12,color:'#64748b'}}>
          Choose an enrolled member or type their email to generate a direct activation URL.
        </p>
        <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:260}}>
            <label className="field-label" style={{margin:0}}>
              Enrolled member email
              <input
                type="email"
                placeholder="student@college.edu or faculty@college.edu"
                value={targetEmail}
                onChange={e=>setTargetEmail(e.target.value)}
              />
            </label>
          </div>
          <Button
            disabled={!targetEmail.trim()||busyEmail===targetEmail.trim()}
            onClick={()=>{issueInvite(targetEmail.trim());setTargetEmail('');}}
            style={{backgroundColor:'#0f766e',color:'#ffffff',gap:6,height:44}}
          >
            <Send size={14}/> Generate Invitation
          </Button>
        </div>
      </div>

      <div className="filters" style={{marginBottom:18}}>
        <Choice label="Filter by Cohort" value={selectedCohort} onChange={setSelectedCohort} items={cohortChoices}/>
        <Choice label="Filter by Status" value={statusFilter} onChange={setStatusFilter} items={statusChoices}/>
        <label className="field-label" style={{flex:1}}>
          Search Roster
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </label>
      </div>

      {visibleRoster.length ? (
        <DataTable
          heads={['Person & Student ID', 'Role', 'Cohort', 'Account Status', 'Consent', 'Actions']}
          rows={visibleRoster.map((r:any)=>[
            <div key="person">
              <b>{r.name}</b>
              <small className="block-text">{r.email}</small>
              {r.studentId && <small className="block-text" style={{color:'#64748b'}}>ID: {r.studentId}</small>}
            </div>,
            <span
              key="role"
              className="status"
              style={{
                textTransform:'capitalize',
                background: r.role==='faculty' ? '#f5f3ff' : '#eff6ff',
                color: r.role==='faculty' ? '#6d28d9' : '#1d4ed8'
              }}
            >
              {r.role}
            </span>,
            cohorts.find(c=>c.id===r.cohort)?.name||r.cohort,
            r.activated === 1 ? (
              <span key="status" className="status" style={{background:'#e2f2ea',color:'#065f46'}}>
                ● Activated
              </span>
            ) : r.pending_invites > 0 ? (
              <span key="status" className="status" style={{background:'#fef3c7',color:'#92400e'}}>
                ● Invited (Pending)
              </span>
            ) : (
              <span key="status" className="status" style={{background:'#f1f5f9',color:'#64748b'}}>
                ○ Uninvited
              </span>
            ),
            r.consent ? <span key="consent" style={{color:'#065f46',fontSize:12}}>Confirmed</span> : <span key="consent" style={{color:'#d97706',fontSize:12}}>Pending</span>,
            <Button
              key="btn"
              variant={r.activated===1 ? "outline" : r.pending_invites>0 ? "outline" : "default"}
              size="sm"
              disabled={busyEmail===r.email}
              onClick={()=>issueInvite(r.email)}
              style={r.activated!==1 && !(r.pending_invites>0) ? {backgroundColor:'#0f766e',color:'#ffffff'} : undefined}
            >
              {busyEmail===r.email ? 'Generating...' : r.activated===1 ? 'Re-issue Invite' : r.pending_invites>0 ? 'Re-issue Invite' : 'Generate Invite'}
            </Button>
          ])}
        />
      ) : (
        <div className="empty-state">
          <h3>No roster members found</h3>
          <p>No students or faculty match your current filter criteria.</p>
        </div>
      )}
    </section>
  );
}
