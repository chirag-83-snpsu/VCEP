'use client';

/**
 * VCEP Drive Edition 3 student-only learning experience.
 * This route fetches authenticated course lessons on demand from /api/guided/session/:id.
 * Full lesson content is guarded server-side and never bundled in client assets.
 */
import {useCallback, useEffect, useMemo, useState} from 'react';
import {safeCatalogue} from '@/lib/catalogue-metadata';
import BrandLogo from '@/components/brand-logo';
import SessionIcon from '@/components/session-icon';
import { Session01Workstation } from './workstations/session-01-workstation';
import { Session02Workstation } from './workstations/session-02-workstation';
import { Session03Workstation } from './workstations/session-03-workstation';
import { Session04Workstation } from './workstations/session-04-workstation';
import { Session05Workstation } from './workstations/session-05-workstation';
import { Session06Workstation } from './workstations/session-06-workstation';
import { Session07Workstation } from './workstations/session-07-workstation';
import { Session08Workstation } from './workstations/session-08-workstation';
import { Session09Workstation } from './workstations/session-09-workstation';
import { Session10Workstation } from './workstations/session-10-workstation';
import { Session11Workstation } from './workstations/session-11-workstation';
import { Session12Workstation } from './workstations/session-12-workstation';
import { Session13Workstation } from './workstations/session-13-workstation';
import { Session14Workstation } from './workstations/session-14-workstation';
import { Session15Workstation } from './workstations/session-15-workstation';
import { Session16Workstation } from './workstations/session-16-workstation';
import { Session17Workstation } from './workstations/session-17-workstation';
import { Session18Workstation } from './workstations/session-18-workstation';
import { Session19Workstation } from './workstations/session-19-workstation';
import { Session20Workstation } from './workstations/session-20-workstation';
import { Session21Workstation } from './workstations/session-21-workstation';
import { Session22Workstation } from './workstations/session-22-workstation';
import { Session23Workstation } from './workstations/session-23-workstation';
import { Session24Workstation } from './workstations/session-24-workstation';
import { Session01PracticeLab } from './components/session-01-practice-lab';
import { Session01StartupJourney } from './components/session-01-startup-journey';
import { Session02TeamworkJourney } from './components/session-02-teamwork-journey';
import { Session03CommunicationJourney } from './components/session-03-communication-journey';
import { Session04MeetingJourney } from './components/session-04-meeting-journey';
import { Session05AccountingJourney } from './components/session-05-accounting-journey';
import { Session06LedgerJourney } from './components/session-06-ledger-journey';
import { Session07CleaningJourney } from './components/session-07-cleaning-journey';
import { Session08ReconciliationJourney } from './components/session-08-reconciliation-journey';
import { Session09PerformanceJourney } from './components/session-09-performance-journey';
import { Session10DashboardJourney } from './components/session-10-dashboard-journey';
import { Session11GSTJourney } from './components/session-11-gst-journey';
import { Session12ReceivablesJourney } from './components/session-12-receivables-journey';
import { Session13AIJourney } from './components/session-13-ai-journey';
import { Session14AIJourney } from './components/session-14-ai-journey';
import { Session15SalesJourney } from './components/session-15-sales-journey';
import { Session16DecisionJourney } from './components/session-16-decision-journey';
import { Session17DiscoveryJourney } from './components/session-17-discovery-journey';
import { Session18PlanningJourney } from './components/session-18-planning-journey';
import { Session19ExecutionJourney } from './components/session-19-execution-journey';
import { Session20ChangeJourney } from './components/session-20-change-journey';
import { Session21PortfolioJourney } from './components/session-21-portfolio-journey';
import { Session22HiringJourney } from './components/session-22-hiring-journey';
import { Session23PresentationJourney } from './components/session-23-presentation-journey';
import { Session24PassportJourney } from './components/session-24-passport-journey';
import { OfficialSubmissionStation } from './components/official-submission-station';
import { useAutomaticReview } from '@/lib/review-engine/engine';
import { StageStatus, StageName, ReviewCheckItem } from '@/lib/review-engine/types';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import './guided-learning.css';

type SourceTable = {title:string;note:string;headers:string[];rows:string[][]};
type WorkTable = {title:string;headers:string[];rows:string[][]};
type Rubric = {name:string;points:number;evidence:string};
type Lesson = {
  id:number;title:string;edition:string;minutes:number;track:number;summary:string;
  outcome:string;deliverable:string;case:string;concept:string;example:string;assignment:string;
  sourceTables:SourceTable[];workTables:WorkTable[];workPrompts:string[];
  support:string[];beforeSubmission:string[];rubric:Rubric[];
  squad:string;reviewRoles:string;aiPrompt:string;aiPolicy:string;submission:string;
  aiLogFields?:string[];controlledAssessment:boolean;sourceLink:string;
};

const sections=['Overview','Learn','Case','Work','Team','Review'] as const;
type Section=typeof sections[number];
const tracks=[
 {name:'Corporate Foundations',range:'01–06',short:'Professional essentials'},
 {name:'Finance & Analytics',range:'07–12',short:'Numbers into decisions'},
 {name:'AI & Business Execution',range:'13–18',short:'Tools and judgment'},
 {name:'Projects & Career',range:'19–24',short:'Evidence and readiness'},
];
const regularPlan=[['0–10','Recall and objective'],['10–25','Trainer concept and example'],['25–50','Individual attempt'],['50–60','Break'],['60–95','Squad challenge'],['95–115','Challenge and verification'],['115–130','Revision and assessment'],['130–135','Handover']];
const specialPlans:Record<number,string[][]>={
  1:[['0–5','Briefing'],['5–65','Independent Baseline A (trainer-controlled)'],['65–75','Break'],['75–90','Concept explanation'],['90–115','Individual business lab'],['115–130','Review and verification'],['130–135','Close']],
  22:[['0–5','Instructions'],['5–65','Independent Exit B (trainer-controlled)'],['65–75','Break'],['75–110','Structured interviews'],['110–130','Development plan'],['130–135','Close']],
  24:[['0–10','Reviewer briefing'],['10–100','Six squad presentations'],['100–120','Individual defence'],['120–130','Reconciliation and audit'],['130–135','Close']],
};
const padded=(id:number)=>String(id).padStart(2,'0');
const cacheKey=(id:number)=>`vcep-drive-edition3:session:${padded(id)}:preview`;
const blankDraft=():Record<string,string>=>({});

function SmallTable({headers,rows,title,notes,interactive,draft,onChange,id,index}:{
 headers:string[];rows:string[][];title:string;notes?:string;interactive?:boolean;
 draft?:Record<string,string>;onChange?:(k:string,v:string)=>void;id:number;index:number;
}){
 return <div className="v3-table-block">
  <div className="v3-table-heading"><h4>{title}</h4>{interactive?<span>Editable working sheet</span>:<span>Reference data</span>}</div>
  {notes&&<p className="v3-small">{notes}</p>}
  <div className="v3-table-scroll"><table className="v3-table"><thead><tr>{headers.map((h,j)=><th key={j} scope="col">{h}</th>)}</tr></thead>
  <tbody>{rows.map((cells,r)=><tr key={r}>{cells.map((original,c)=>{
    const key=`work:${id}:${index}:${r}:${c}`;
    return <td key={c}>{interactive&&!original ? <textarea aria-label={`${title}, row ${r+1}, ${headers[c]}`} rows={2}
      value={draft?.[key]||''} onChange={e=>onChange?.(key,e.target.value)} placeholder="Enter answer"/> : <span>{original||'—'}</span>}</td>;
  })}</tr>)}</tbody></table></div>
 </div>;
}
function IconArrow(){return <span aria-hidden="true">→</span>}
function safeLoad(id:number){try{return JSON.parse(sessionStorage.getItem(cacheKey(id))||'{}') as Record<string,string>}catch{return blankDraft()}}
function Field({title,value,onChange,multiline=true}:{title:string;value:string;onChange:(v:string)=>void;multiline?:boolean}){
 return <label className="v3-field"><span>{title}</span>{multiline?<textarea rows={4} value={value} onChange={e=>onChange(e.target.value)} placeholder="Write your own response. Show the method and evidence."/>:<input value={value} onChange={e=>onChange(e.target.value)} placeholder="Your response"/>}</label>;
}

const stageDisplayOrder: { name: StageName; idx: string }[] = [
  { name: 'Overview', idx: '01' },
  { name: 'Learn', idx: '02' },
  { name: 'Case', idx: '03' },
  { name: 'Work', idx: '04' },
  { name: 'Team', idx: '05' },
];

function getReviewStatusBadge(status: StageStatus) {
  switch (status) {
    case 'reviewed':
      return { label: 'Verified', className: 'pill-reviewed' };
    case 'needs_revision':
      return { label: 'Revision Required', className: 'pill-needs_revision' };
    case 'in_progress':
      return { label: 'In Progress', className: 'pill-in_progress' };
    case 'awaiting_trainer':
      return { label: 'Awaiting Faculty', className: 'pill-awaiting_trainer' };
    default:
      return { label: 'Not Started', className: 'pill-not_started' };
  }
}

function getCheckItemBadge(status: 'passed' | 'failed' | 'warning' | 'pending') {
  switch (status) {
    case 'passed':
      return { label: 'Verified', className: 'badge-passed' };
    case 'failed':
      return { label: 'Revise', className: 'badge-failed' };
    case 'warning':
      return { label: 'Attention', className: 'badge-warning' };
    default:
      return { label: 'Pending', className: 'badge-pending' };
  }
}

export default function GuidedLearningPage(){
 const [selected,setSelected]=useState(1);
 const [section,setSection]=useState<Section>('Overview');
 const [sessionStage,setSessionStage]=useState<number>(1);
 const [draft,setDraft]=useState<Record<string,string>>({});
 type SaveStatus = 'saving' | 'saved' | 'unsaved' | 'error';
 const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
 const [lastSavedTime, setLastSavedTime] = useState<string>('');
 const [query,setQuery]=useState('');
 const [clearArmed,setClearArmed]=useState(false);

 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [loading,setLoading]=useState(true);
 const [authError,setAuthError]=useState<{status:number;message:string}|null>(null);
 const [boot,setBoot]=useState<any>(null);

 const meta=useMemo(()=>safeCatalogue.find(s=>s.id===selected)||safeCatalogue[0],[selected]);
 const filtered=useMemo(()=>safeCatalogue.filter(s=>(`${s.title} ${s.summary}`).toLowerCase().includes(query.toLowerCase())),[query]);

 const user = boot?.user;
 const student = user?.role === 'student';
 const currentSubmission = useMemo(() => {
   return (boot?.submissions || []).find((s: any) => s.session === selected);
 }, [boot, selected]);

 const parsedGrade = useMemo(() => {
   if (!currentSubmission?.grade) return null;
   try {
     return typeof currentSubmission.grade === 'string' ? JSON.parse(currentSubmission.grade) : currentSubmission.grade;
   } catch {
     return null;
   }
 }, [currentSubmission]);

 const numericTotalGrade = useMemo(() => {
   if (!parsedGrade) return null;
   return ['execution', 'reasoning', 'communication', 'process'].reduce((sum, k) => sum + Number(parsedGrade[k] || 0), 0);
 }, [parsedGrade]);

 const reviewReport = useAutomaticReview(selected, lesson, draft);
 const isControlledAssessment = Boolean(lesson?.controlledAssessment || reviewReport.overallStatus === 'awaiting_trainer');
 const reviewCompletionRate = reviewReport.totalChecks > 0 ? Math.round((reviewReport.passedChecks / reviewReport.totalChecks) * 100) : 0;
 const reviewDisclaimer = "Automatic practice review is formative feedback to guide your learning and independent problem solving. Official grading, certification, and marks are awarded exclusively through faculty review in the assessed workspace.";

 const choose=useCallback((id:number,addHistory=true,initialSection?:Section,initialStage?:number)=>{
   const target=Math.max(1,Math.min(24,id));
   setSelected(target);setSection(initialSection||'Overview');
   if (initialStage && initialStage >= 1 && initialStage <= 6) {
     setSessionStage(initialStage);
   }
   const loaded = safeLoad(target);
   setDraft(loaded);
   setSaveStatus('saved');
   setLastSavedTime('');
   setClearArmed(false);
   if(addHistory && typeof window !== 'undefined'){
     const u=new URL(window.location.href);
     u.searchParams.set('session',String(target));
     if (target === 1) {
       if (initialStage) u.searchParams.set('stage', String(initialStage));
     } else {
       u.searchParams.delete('stage');
     }
     if(initialSection) u.searchParams.set('section',initialSection);
     history.pushState({session:target, stage: initialStage},'',u.toString());
   }
   window.scrollTo({top:0,behavior:'instant'});
 },[]);

 useEffect(()=>{
   const params=new URLSearchParams(window.location.search);
   const parsed=Number(params.get('session'));
   const stageParam=Number(params.get('stage'));
   const secParam=params.get('section') as Section;
   const initialSec=sections.includes(secParam)?secParam:'Overview';
   const id=Number.isInteger(parsed)&&parsed>=1&&parsed<=24?parsed:1;
   const stageVal = Number.isInteger(stageParam) && stageParam >= 1 && stageParam <= 6 ? stageParam : (
     secParam === 'Overview' ? 1 :
     secParam === 'Learn' ? 2 :
     secParam === 'Case' ? 3 :
     secParam === 'Work' ? 4 :
     secParam === 'Team' ? 5 :
     secParam === 'Review' ? 6 : 1
   );
   setSessionStage(stageVal);
   choose(id,false,initialSec,stageVal);
   const pop=()=>{
     const p=new URLSearchParams(window.location.search);
     const num=Number(p.get('session'));
     const sec=p.get('section') as Section;
     const stg=Number(p.get('stage'));
     const validStage = Number.isInteger(stg) && stg >= 1 && stg <= 6 ? stg : 1;
     setSessionStage(validStage);
     choose(Number.isInteger(num)&&num>=1&&num<=24?num:1,false,sections.includes(sec)?sec:'Overview',validStage);
   };
   window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);
 },[choose]);

 const refreshBoot = useCallback(() => {
   fetch('/api/boot')
     .then(r => r.json())
     .then((d: any) => { if (d && !d.error) setBoot(d); })
     .catch(() => {});
 }, []);

 useEffect(()=>{
   refreshBoot();
 }, [refreshBoot]);

 useEffect(()=>{
   let active=true;
   setLoading(true);
   setAuthError(null);

   fetch(`/api/guided/session/${selected}`)
     .then(async res=>{
       const data=(await res.json().catch(()=>({}))) as any;
       if(!active)return;
       if(!res.ok){
         if (res.status === 401 && typeof window !== 'undefined') {
           const currentPath = window.location.pathname + window.location.search;
           window.location.replace(`/signin?return_to=${encodeURIComponent(currentPath)}`);
           return;
         }
         setAuthError({
           status:res.status,
           message:data.error||'Access restricted.'
         });
         setLesson(null);
       }else{
         setLesson(data.lesson);
         setAuthError(null);
       }
     })
     .catch(()=>{
       if(!active)return;
       setAuthError({status:500,message:'Could not connect to the learning service.'});
       setLesson(null);
     })
     .finally(()=>{
       if(active)setLoading(false);
     });

   return ()=>{active=false;};
 },[selected]);

 const persistDraft = (targetDraft: Record<string, string>) => {
   setSaveStatus('saving');
   try {
     sessionStorage.setItem(cacheKey(selected), JSON.stringify(targetDraft));
     const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
     setLastSavedTime(timeStr);
     setSaveStatus('saved');
   } catch {
     setSaveStatus('error');
   }
 };

 function update(key:string,value:string){
   setDraft((prev) => {
     const next = { ...prev, [key]: value };
     persistDraft(next);
     return next;
   });
 }

 function updateBatch(updates: Record<string, string>) {
   setDraft((prev) => {
     const next = { ...prev, ...updates };
     persistDraft(next);
     return next;
   });
 }

 function handleRetrySave() {
   persistDraft(draft);
 }

 function clearDraft(){
  if(!clearArmed){setClearArmed(true);return}
  try{sessionStorage.removeItem(cacheKey(selected))}catch{}
  setDraft({});setSaveStatus('saved');setLastSavedTime('');setClearArmed(false);
 }
 const copyAi=async()=>{
  if(!lesson)return;
  try{await navigator.clipboard.writeText(lesson.aiPrompt);setSaveStatus('saved');}
  catch{setSaveStatus('error');}
 };
 const writeField=(key:string,label:string)=><Field key={key} title={label} value={draft[key]||''} onChange={v=>update(key,v)}/>;

 return <div className="v3-root">
  <header className="v3-header"><div className="v3-header-inner"><a href="/" className="v3-brand" aria-label="VCEP home"><BrandLogo size="md" /></a><nav className="v3-nav"><span className="v3-edition">STUDENT EDITION 3.0</span><a href="/">Home</a></nav></div></header>
  <div className="v3-shell"><aside className="v3-sidebar" aria-label="Choose a guided session">
    <div className="v3-side-head"><small>VCEP LEARNING</small><h2>24 Sessions</h2><p>Trainer-guided lessons</p></div>
    <label className="v3-search">Find a session<input type="search" placeholder="Search by topic" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    {tracks.map((track,i)=>{
      const items=filtered.filter(s=>s.track===i+1);return items.length>0&&<div className="v3-side-track" key={track.name}>
      <div className="v3-track-name">{`0${i+1}`} · {track.name}</div>
      {items.map(s=><button key={s.id} className={'v3-side-session '+(s.id===selected?'is-current':'')} type="button" aria-current={s.id===selected?'page':undefined} onClick={()=>choose(s.id)}><span>{padded(s.id)}</span><span>{s.title}</span></button>)}
    </div>})}
    {filtered.length===0&&<p className="v3-small">No sessions found.</p>}
  </aside>
  <main className="v3-main" id="main">
   <div className="v3-breadcrumb"><span>Track {padded(meta.track)}</span><span aria-hidden="true">/</span><span>Session {padded(selected)}</span><span aria-hidden="true">/</span><span>Guided Learning</span></div>
   <div className="v3-topline">
      <div style={{display:'flex',gap:'16px',alignItems:'flex-start'}}>
        <SessionIcon session={selected} size="lg" />
        <div>
          <div className="v3-eyebrow">
            {selected >= 1 && selected <= 15 ? (
              <>VCEP COMMERCE WORKLAB</>
            ) : (
              <>SESSION {padded(selected)} OF 24 <span className="v3-dot">·</span> 135 MINUTES</>
            )}
          </div>
          <h1>
            {selected === 1
              ? 'Start a Business. Think Like a Founder.'
              : selected === 2
              ? 'Professional Identity and Teamwork'
              : selected === 3
              ? 'Workplace Communication'
              : selected === 4
              ? 'Meetings and Reporting'
              : selected === 5
              ? 'Accounting Transactions'
              : selected === 6
              ? 'Ledger and Month End Close'
              : selected === 7
              ? 'Excel and Data Cleaning'
              : selected === 8
              ? 'Bank Reconciliation'
              : selected === 9
              ? 'Business Finance and Performance'
              : selected === 10
              ? 'MIS Dashboard Development'
              : selected === 11
              ? 'GST and Invoice Review'
              : selected === 12
              ? 'Receivables and Working Capital'
              : selected === 13
              ? 'AI for Commerce Professionals'
              : selected === 14
              ? 'AI Verification and Automation'
              : selected === 15
              ? 'Customer and Sales Operations'
              : selected === 16
              ? 'Commercial Decision Making'
              : selected === 17
              ? 'Industry Challenge Discovery'
              : selected === 18
              ? 'Solution Design and Project Planning'
              : selected === 19
              ? 'Project Execution and Quality Assurance'
              : selected === 20
              ? 'Management Review and Change Control'
              : selected === 21
              ? 'Resume and Portfolio Development'
              : selected === 22
              ? 'Hiring Simulation and Exit Assessment'
              : selected === 23
              ? 'Corporate Presentation Preparation'
              : selected === 24
              ? 'Corporate Demo Day and Industry Passport'
              : (lesson?.title || meta.title)}
          </h1>
          <p>
            {selected === 1
              ? 'Find a real problem. Build a business idea. Pitch your solution.'
              : selected === 2
              ? 'Join the team. Own the work.'
              : selected === 3
              ? 'Write like a professional.'
              : selected === 4
              ? 'Run the meeting. Capture the decision.'
              : selected === 5
              ? 'Work as an accounts executive.'
              : selected === 6
              ? 'Close the books with confidence.'
              : selected === 7
              ? 'Turn messy data into reliable data.'
              : selected === 8
              ? 'Find the difference. Prove the balance.'
              : selected === 9
              ? 'Read the numbers. Challenge the story.'
              : selected === 10
              ? 'Build a dashboard that supports decisions.'
              : selected === 11
              ? 'Review the invoice before you approve it.'
              : selected === 12
              ? 'Turn overdue invoices into a cash plan.'
              : selected === 13
              ? 'Use AI responsibly. Verify the work.'
              : selected === 14
              ? 'Audit the AI. Control the workflow.'
              : selected === 15
              ? 'Manage the pipeline. Own the follow-up.'
              : selected === 16
              ? 'Make the decision with numbers.'
              : selected === 17
              ? 'Discover the problem before building.'
              : selected === 18
              ? 'Choose a solution. Plan the delivery.'
              : selected === 19
              ? 'Build the prototype. Prove it works.'
              : selected === 20
              ? 'Control the change. Keep the evidence.'
              : selected === 21
              ? 'Turn real work into a credible resume.'
              : selected === 22
              ? 'Show your skills independently.'
              : selected === 23
              ? 'Present the work. Defend the decision.'
              : selected === 24
              ? 'Show the evidence. Own your growth.'
              : (lesson?.outcome || meta.summary)}
          </p>
        </div>
      </div>
      <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
        {selected === 1 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-pitch-deck');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Create Your Pitch Deck →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-opportunity');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Understand the Opportunity</span>
            </button>
          </>
        ) : selected === 2 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-charter');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build Profile & Charter →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-join');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Join Your Team</span>
            </button>
          </>
        ) : selected === 3 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-compose');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Compose the Response →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-request');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Understand the Request</span>
            </button>
          </>
        ) : selected === 4 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-meeting');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Run Meeting & Record Actions →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-crisis');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Understand Delivery Crisis</span>
            </button>
          </>
        ) : selected === 5 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-journal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Prepare the Journal →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-transactions');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Read Source Transactions</span>
            </button>
          </>
        ) : selected === 6 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-close');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Complete Month-End Close →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-investigate');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Investigate Ledger Error</span>
            </button>
          </>
        ) : selected === 7 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-clean');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Clean, Validate & Report →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-raw');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Inspect Raw Receipts</span>
            </button>
          </>
        ) : selected === 8 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-reconcile');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Prepare the Reconciliation →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-compare');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Compare Bank & Books</span>
            </button>
          </>
        ) : selected === 9 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-findings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Write Management Findings →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-performance');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Review Business Performance</span>
            </button>
          </>
        ) : selected === 10 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-dashboard');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build MIS Dashboard →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-question');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Choose Management Question</span>
            </button>
          </>
        ) : selected === 11 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-tax');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Verify Tax & Exceptions →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-invoices');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Inspect Invoice Evidence</span>
            </button>
          </>
        ) : selected === 12 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-plan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build Collection & Cash Plan →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-ageing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Understand Who Owes What</span>
            </button>
          </>
        ) : selected === 13 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-verify');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Create & Verify Output →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-task');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Choose Safe AI Task</span>
            </button>
          </>
        ) : selected === 14 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-workflow');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build Verified Workflow →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-audit');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Challenge the AI Report</span>
            </button>
          </>
        ) : selected === 15 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-crm');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build CRM Action Queue →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-pipeline');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Review Sales Pipeline</span>
            </button>
          </>
        ) : selected === 16 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-decide');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Compare Scenarios & Decide →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-proposal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Understand Pricing Proposal</span>
            </button>
          </>
        ) : selected === 17 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-brief');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Write Discovery Brief →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-client');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Listen to Client Challenge</span>
            </button>
          </>
        ) : selected === 18 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-plan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Plan Tasks & Acceptance Tests →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-solution');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Select Feasible Solution</span>
            </button>
          </>
        ) : selected === 19 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-test');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Test & Record Evidence →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-build');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build Approved Solution</span>
            </button>
          </>
        ) : selected === 20 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-update');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Update & Retest the Model →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-review');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Review Approved Change</span>
            </button>
          </>
        ) : selected === 21 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Build Resume & Portfolio →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-evidence');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Find Evidence</span>
            </button>
          </>
        ) : selected === 22 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-review');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Complete Verified Review →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-prepare');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Prepare for Interview</span>
            </button>
          </>
        ) : selected === 23 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-rehearsal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Rehearse Demonstration →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-management');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Choose Management Needs</span>
            </button>
          </>
        ) : selected === 24 ? (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-area-passport');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Verify Industry Passport →</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-area-present');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Present & Defend Work</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="vcep-btn-primary"
              onClick={() => {
                const el = document.getElementById('vcep-official-submission-station');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>Official Submission & Grade Review ↓</span>
            </button>
            <button
              className="v3-outline"
              type="button"
              onClick={() => {
                const el = document.getElementById('vcep-official-submission-station');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <span>My Assessment Status</span>
            </button>
          </>
        )}
      </div>
    </div>
   <div className="v3-statusbar">
     <div className={`v3-save-badge is-${saveStatus}`}>
       <span className="v3-indicator"/>
       {saveStatus === 'saving' && <span>Saving…</span>}
       {saveStatus === 'saved' && (
         <span>
           {lastSavedTime ? `All changes saved · Last saved at ${lastSavedTime}` : 'All changes saved'}
         </span>
       )}
       {saveStatus === 'unsaved' && <span>Unsaved changes</span>}
       {saveStatus === 'error' && (
         <span className="v3-error-retry-wrap">
           <span>Unable to save — </span>
           <button type="button" onClick={handleRetrySave} className="v3-retry-inline-btn">
             Retry
           </button>
         </span>
       )}
     </div>
     <span className="v3-status-notice">In-Platform Work · Practice saved in this browser</span>
   </div>
   <div className="v3-mobile-selector"><label htmlFor="v3-mobile-select">Choose session</label><select id="v3-mobile-select" value={selected} onChange={e=>choose(Number(e.target.value))}>{safeCatalogue.map(s=><option key={s.id} value={s.id}>{padded(s.id)} · {s.title}</option>)}</select></div>
   {selected > 24 && (
     <nav aria-label="Lesson stages" className="v3-tabs">{sections.map((s,i)=><button key={s} type="button" className={section===s?'is-active':''} aria-current={section===s?'step':undefined} onClick={()=>setSection(s)}><span className="v3-tab-number">{padded(i+1)}</span>{s}{s==='Work' ? ' · Workstation' : ''}</button>)}</nav>
   )}

   {loading && (
     <div className="v3-content">
       <div className="v3-panel" style={{textAlign:'center',padding:'3.5rem 1.5rem'}}>
         <span className="v3-eyebrow">VERIFYING ACCESS</span>
         <h2 style={{marginTop:'0.5rem'}}>Loading session {padded(selected)}...</h2>
         <p className="v3-small" style={{marginTop:'0.5rem'}}>Checking cohort release schedule and enrolment status.</p>
       </div>
     </div>
   )}

   {!loading && authError && (
     <div className="v3-content">
       <div className="v3-warning" style={{margin:'2rem 0',padding:'2rem'}}>
         <span className="v3-eyebrow">{authError.status===401?'SIGN IN REQUIRED':'ACCESS RESTRICTED'}</span>
         <h2 style={{margin:'0.5rem 0 1rem'}}>
           {authError.status===401?'Sign In to Access Guided Learning':'Session Not Available'}
         </h2>
         <p style={{fontSize:'1rem',lineHeight:'1.6',marginBottom:'1.5rem'}}>
           {authError.message}
         </p>
         <div className="v3-action-bar">
           <a
            className="v3-primary"
            href={
              authError.status === 401
                ? `/signin?return_to=${encodeURIComponent(
                    typeof window !== 'undefined'
                      ? window.location.pathname + window.location.search
                      : `/guided-learning?session=${selected}`
                  )}`
                : '/'
            }
          >
             {authError.status===401?'Sign In with College Account →':'Return to Course Catalogue →'}
           </a>
           <a className="v3-outline" href="/">Return to VCEP Home</a>
         </div>
       </div>
     </div>
   )}

   {!loading && !authError && lesson && (
     selected >= 1 && selected <= 24 ? (
       <div className="v3-content" key={'session-' + selected + '-journey'}>
         {selected === 1 && <Session01StartupJourney onUpdateDraft={update} />}
         {selected === 2 && <Session02TeamworkJourney onUpdateDraft={update} />}
         {selected === 3 && <Session03CommunicationJourney onUpdateDraft={update} />}
         {selected === 4 && <Session04MeetingJourney onUpdateDraft={update} />}
         {selected === 5 && <Session05AccountingJourney onUpdateDraft={update} />}
         {selected === 6 && <Session06LedgerJourney onUpdateDraft={update} />}
         {selected === 7 && <Session07CleaningJourney onUpdateDraft={update} />}
         {selected === 8 && <Session08ReconciliationJourney onUpdateDraft={update} />}
         {selected === 9 && <Session09PerformanceJourney onUpdateDraft={update} />}
         {selected === 10 && <Session10DashboardJourney onUpdateDraft={update} />}
         {selected === 11 && <Session11GSTJourney onUpdateDraft={update} />}
         {selected === 12 && <Session12ReceivablesJourney onUpdateDraft={update} />}
         {selected === 13 && <Session13AIJourney onUpdateDraft={update} />}
         {selected === 14 && <Session14AIJourney onUpdateDraft={update} />}
         {selected === 15 && <Session15SalesJourney onUpdateDraft={update} />}
         {selected === 16 && <Session16DecisionJourney onUpdateDraft={update} />}
         {selected === 17 && <Session17DiscoveryJourney onUpdateDraft={update} />}
         {selected === 18 && <Session18PlanningJourney onUpdateDraft={update} />}
         {selected === 19 && <Session19ExecutionJourney onUpdateDraft={update} />}
         {selected === 20 && <Session20ChangeJourney onUpdateDraft={update} />}
         {selected === 21 && <Session21PortfolioJourney onUpdateDraft={update} />}
         {selected === 22 && <Session22HiringJourney onUpdateDraft={update} />}
         {selected === 23 && <Session23PresentationJourney onUpdateDraft={update} />}
         {selected === 24 && <Session24PassportJourney onUpdateDraft={update} />}

         <OfficialSubmissionStation
           session={selected}
           user={user}
           draftAnswers={draft}
           onUpdateDraftAnswer={update}
           onUpdateBatch={updateBatch}
           bootSubmissions={boot?.submissions}
           onSubmissionSuccess={refreshBoot}
         />
       </div>
     ) : (
      <div className="v3-content" key={`${selected}-${section}`}>
     {section==='Overview'&&<>
       <div className="v3-mission"><span className="v3-eyebrow">TODAY'S MISSION</span><h2>{lesson.title}</h2><p>{lesson.summary}</p></div>
       <div className="v3-two"><div className="v3-panel"><span className="v3-eyebrow">YOUR TASK</span><h3>What you'll do</h3><p>{lesson.assignment}</p></div><div className="v3-panel"><span className="v3-eyebrow">YOUR EVIDENCE</span><h3>What you'll produce</h3><p>{lesson.deliverable}</p></div></div>
       {lesson.controlledAssessment&&<div className="v3-warning"><strong>Controlled assessment</strong><p>{selected===1?'Baseline A is issued separately by the trainer. Work independently without AI or peer help during the 60-minute assessment.':'Exit B is issued separately by the trainer. No AI or peer help is permitted during the assessment or interview.'}</p></div>}
       <details className="v3-details"><summary>Class schedule · 135 minutes</summary><div className="v3-plan">{(specialPlans[selected]||regularPlan).map((row,i)=><div key={i}><strong>{row[0]} min</strong><span>{row[1]}</span></div>)}</div></details>
       {selected === 1 && <Session01PracticeLab onNavigateToTab={setSection} />}
       <div className="v3-next-section"><button className="v3-primary" type="button" onClick={()=>setSection('Learn')}>Start Learning <IconArrow/></button></div>
     </>}
     {section==='Learn'&&<>
       <div className="v3-section-intro"><span className="v3-eyebrow">CORE CONCEPT</span><h2>Understand the principle</h2><p>Read the explanation, review the example, then explain the idea in your own words.</p></div>
       <div className="v3-panel"><h3>Concept briefing</h3><p>{lesson.concept}</p></div>
       <div className="v3-example"><span className="v3-eyebrow">WORKED EXAMPLE</span><p>{lesson.example}</p></div>
       {writeField('concept:explain','In your own words, how would you explain this to a colleague?')}
       <div className="v3-next-section"><button className="v3-primary" type="button" onClick={()=>setSection('Case')}>View Business Case <IconArrow/></button></div>
     </>}
     {section==='Case'&&<>
       <div className="v3-section-intro"><span className="v3-eyebrow">BUSINESS SIMULATION</span><h2>The business situation</h2><p>Read the complete facts. Keep source records separate from your assumptions.</p></div>
       <div className="v3-panel"><h3>Case briefing</h3><p>{lesson.case}</p></div>
       {lesson.support.map((s,i)=><div className="v3-panel" key={i}><h3>Additional instructions {lesson.support.length>1?i+1:''}</h3><p>{s}</p></div>)}
       {lesson.sourceTables.map((t,i)=><SmallTable key={i} id={selected} index={i} title={t.title} notes={t.note} headers={t.headers} rows={t.rows}/>)}
       <div className="v3-next-section"><button className="v3-primary" type="button" onClick={()=>setSection('Work')}>Begin Your Work <IconArrow/></button></div>
     </>}
     {section==='Work'&&<>
       {selected === 1 ? (
         <Session01Workstation />
       ) : selected === 2 ? (
         <Session02Workstation />
       ) : selected === 3 ? (
         <Session03Workstation />
       ) : selected === 4 ? (
         <Session04Workstation />
       ) : selected === 5 ? (
         <Session05Workstation />
       ) : selected === 6 ? (
         <Session06Workstation />
       ) : selected === 7 ? (
         <Session07Workstation />
       ) : selected === 8 ? (
         <Session08Workstation />
       ) : selected === 9 ? (
         <Session09Workstation />
       ) : selected === 10 ? (
         <Session10Workstation />
       ) : selected === 11 ? (
         <Session11Workstation />
       ) : selected === 12 ? (
         <Session12Workstation />
       ) : selected === 13 ? (
         <Session13Workstation />
       ) : selected === 14 ? (
         <Session14Workstation />
       ) : selected === 15 ? (
         <Session15Workstation />
       ) : selected === 16 ? (
         <Session16Workstation />
       ) : selected === 17 ? (
         <Session17Workstation />
       ) : selected === 18 ? (
         <Session18Workstation />
       ) : selected === 19 ? (
         <Session19Workstation />
       ) : selected === 20 ? (
         <Session20Workstation />
       ) : selected === 21 ? (
         <Session21Workstation />
       ) : selected === 22 ? (
         <Session22Workstation />
       ) : selected === 23 ? (
         <Session23Workstation />
       ) : selected === 24 ? (
         <Session24Workstation />
       ) : (
         <>
           <div className="v3-section-intro"><span className="v3-eyebrow">INDIVIDUAL WORK</span><h2>Complete the task</h2><p>Show your method and keep supporting calculations in an original working file.</p></div>
           <div className="v3-panel"><h3>Assignment</h3><p>{lesson.assignment}</p></div>
           {lesson.workTables.map((t,i)=><SmallTable key={i} id={selected} index={i} title={t.title} headers={t.headers} rows={t.rows} interactive draft={draft} onChange={update}/>)}
           {lesson.workPrompts.map((prompt,i)=>writeField(`work-prompt:${i}`,prompt))}
           {writeField('work:analysis','Additional calculations, references or decision notes')}
           <p className="v3-small">This page stores typed practice in your current browser tab only. Spreadsheet formulas, files and official evidence must be kept separately.</p>
           <div className="v3-next-section"><button className="v3-primary" type="button" onClick={()=>setSection('Team')}>Continue to Team Lab <IconArrow/></button></div>
         </>
       )}
     </>}
     {section==='Team'&&<>
       <div className="v3-section-intro"><span className="v3-eyebrow">SQUAD & VERIFICATION</span><h2>Work as professionals</h2><p>Agree on a decision, identify owners and challenge unsupported claims.</p></div>
       <div className="v3-panel"><h3>Team challenge</h3><p>{lesson.squad||'Review the case with your team and document each person’s contribution.'}</p></div>
       <div className="v3-panel"><h3>Review responsibilities</h3><p>{lesson.reviewRoles}</p></div>
       {writeField('team:contribution','My contribution and one correction after team review')}
       {selected===22?<div className="v3-warning"><strong>No AI during Exit B or interviews</strong><p>{lesson.aiPolicy}</p></div>:<details className="v3-details"><summary>Optional AI practice · after your own attempt</summary><div className="v3-ai"><p className="v3-small">{lesson.aiPolicy}</p><blockquote>{lesson.aiPrompt}</blockquote><button type="button" className="v3-outline" onClick={copyAi}>Copy approved prompt</button>{(lesson.aiLogFields||[]).map((field,i)=>writeField(`ai-log:${i}`,field))}</div></details>}
       {writeField('team:judgement','One decision that must remain my own')}
       <div className="v3-next-section"><button className="v3-primary" type="button" onClick={()=>setSection('Review')}>Review Evidence <IconArrow/></button></div>
     </>}
     {section==='Review'&&<>
       <div className="v3-section-intro">
         <span className="v3-eyebrow">STAGE 06 · EVIDENCE REVIEW & HANDOVER</span>
         <h2>My Work & Verification Dashboard</h2>
         <p>Review your saved calculations, written responses, and live faculty evaluation directly inside VCEP.</p>
       </div>

       {/* 1. Live Submission Status & Faculty Evaluation Hero */}
       <div className={`v3-review-hero ${currentSubmission?.status === 'Graded' ? 'is-graded' : currentSubmission?.status === 'Returned' ? 'is-returned' : currentSubmission ? 'is-submitted' : 'is-practice'}`}>
         <div className="v3-review-status-strip">
           <span className={`v3-status-chip ${
             currentSubmission?.status === 'Graded' ? 'chip-graded' :
             currentSubmission?.status === 'Submitted' || currentSubmission?.status === 'Under review' ? 'chip-submitted' :
             currentSubmission?.status === 'Returned' ? 'chip-returned' : 'chip-practice'
           }`}>
             {currentSubmission?.status === 'Graded' ? 'Official Submission · Graded' :
              currentSubmission?.status === 'Under review' ? 'Under Faculty Review' :
              currentSubmission?.status === 'Submitted' ? 'Official Submission Received' :
              currentSubmission?.status === 'Returned' ? 'Returned for Revision' :
              'In-Platform Work · All Changes Saved'}
           </span>
           <span className="text-xs text-slate-500 font-medium">
             {currentSubmission?.created ? `Submitted ${new Date(currentSubmission.created).toLocaleString()}` : (lastSavedTime ? `Draft saved ${lastSavedTime}` : 'Draft saved in this browser')}
           </span>
         </div>

         {currentSubmission?.status === 'Graded' ? (
           <div>
             <div className="v3-grade-display">
               <span className="v3-grade-number">{numericTotalGrade !== null ? numericTotalGrade.toFixed(1) : '—'}</span>
               <span className="v3-grade-max">/ 10 Points Awarded</span>
             </div>
             <div className="v3-rubric-breakdown-grid">
               <div className="v3-rubric-score-cell">
                 <span className="label">Execution</span>
                 <span className="score">{parsedGrade?.execution ?? '—'} / 4</span>
               </div>
               <div className="v3-rubric-score-cell">
                 <span className="label">Reasoning</span>
                 <span className="score">{parsedGrade?.reasoning ?? '—'} / 2</span>
               </div>
               <div className="v3-rubric-score-cell">
                 <span className="label">Communication</span>
                 <span className="score">{parsedGrade?.communication ?? '—'} / 2</span>
               </div>
               <div className="v3-rubric-score-cell">
                 <span className="label">Process</span>
                 <span className="score">{parsedGrade?.process ?? '—'} / 2</span>
               </div>
             </div>
             {currentSubmission?.feedback && (
               <div className="v3-faculty-feedback-box">
                 <h4>Faculty Written Evaluation</h4>
                 <p>{currentSubmission.feedback}</p>
               </div>
             )}
           </div>
         ) : currentSubmission?.status === 'Returned' ? (
           <div>
             <h3 style={{ fontSize: '18px', color: '#92400e', marginBottom: '8px' }}>Returned for Revision</h3>
             <p style={{ fontSize: '13.5px', color: '#78350f', lineHeight: '1.6' }}>
               Your faculty reviewer requested adjustments before awarding marks. Please review the guidance below, update your calculations or explanations, and re-submit through the assessed workspace.
             </p>
             {currentSubmission?.feedback && (
               <div className="v3-faculty-feedback-box" style={{ borderLeftColor: '#d97706' }}>
                 <h4 style={{ color: '#d97706' }}>Faculty Feedback & Required Next Action</h4>
                 <p>{currentSubmission.feedback}</p>
               </div>
             )}
           </div>
         ) : currentSubmission ? (
           <div>
             <h3 style={{ fontSize: '18px', color: '#0369a1', marginBottom: '8px' }}>Official Submission Queued for Review</h3>
             <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.6' }}>
               Your formal attempt has been recorded in the institution registry. Faculty evaluation, 10-point rubric breakdown, and qualitative feedback will appear here once reviewed.
             </p>
           </div>
         ) : (
           <div>
             <h3 style={{ fontSize: '18px', color: '#17245c', marginBottom: '6px' }}>In-Platform Work Saved</h3>
             <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6' }}>
               All your inputs, calculations, and reflection notes are safely recorded inside this browser session. Review your responses below before opening the assessed workspace for certified evaluation.
             </p>
           </div>
         )}
       </div>

       {/* 2. Automatic Formative Learning Review */}
       <div className="v3-review-banner">
         <div className="v3-review-banner-header">
           <div>
             <span className="v3-eyebrow" style={{ color: '#0e746c' }}>AUTOMATIC FORMATIVE FEEDBACK</span>
             <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', margin: '4px 0 6px 0' }}>
               Stage-by-Stage Verification Summary
             </h3>
             <p style={{ margin: 0 }}>
               {isControlledAssessment
                 ? 'This session is a controlled assessment milestone. Formative feedback is provided for practice stages, but official evaluation is reserved for faculty.'
                 : reviewReport.overallStatus === 'reviewed'
                 ? 'All learning stages verified against Drive Edition 3.0 standards and calculation benchmarks.'
                 : reviewReport.overallStatus === 'needs_revision'
                 ? 'One or more stages require calculation corrections or deeper concept explanations before submission.'
                 : 'Complete exercises in stages 01 through 05 to see automatic verification feedback.'}
             </p>
           </div>
           <span className={`v3-review-status-pill ${getReviewStatusBadge(reviewReport.overallStatus).className}`}>
             {getReviewStatusBadge(reviewReport.overallStatus).label}
           </span>
         </div>

         <div className="v3-review-progress-track">
           <div
             className="v3-review-progress-bar"
             style={{
               width: `${reviewCompletionRate}%`,
               background: reviewReport.overallStatus === 'needs_revision' ? '#e11d48' : '#0e746c'
             }}
           />
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
           <span>{reviewReport.passedChecks} of {reviewReport.totalChecks} Learning Checks Verified</span>
           <span>{reviewCompletionRate}% Verified</span>
         </div>

         <div className="v3-review-disclaimer">
           <ShieldCheck size={16} color="#0e746c" style={{ flexShrink: 0 }} />
           <span>{reviewDisclaimer}</span>
         </div>
       </div>

       {/* Actionable Revisit Recommendations Box */}
       {reviewReport.revisitRecommendations.length > 0 && (
         <div className="v3-revisit-box">
           <h4>Action Items Requiring Revision ({reviewReport.revisitRecommendations.length})</h4>
           <ul className="v3-revisit-list">
             {reviewReport.revisitRecommendations.map((rec, i) => (
               <li key={i}>{rec}</li>
             ))}
           </ul>
         </div>
       )}

       {/* 5-Stage Verification Detail Cards */}
       <div className="v3-stages-review-container">
         {stageDisplayOrder.map(({ name, idx }) => {
           const stg = reviewReport.stages[name];
           if (!stg) return null;
           const badge = getReviewStatusBadge(stg.status);
           return (
             <div key={name} className={`v3-stage-card stage-${stg.status}`}>
               <div className="v3-stage-card-head">
                 <div className="v3-stage-title-wrap">
                   <span className="v3-stage-idx">{idx}</span>
                   <div>
                     <h4>Stage {idx} · {name}</h4>
                     <p className="v3-stage-summary-text" style={{ margin: '2px 0 0 0' }}>{stg.summary}</p>
                   </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span className={`v3-review-status-pill ${badge.className}`}>{badge.label}</span>
                   <button
                     type="button"
                     className="v3-action-mini-btn"
                     onClick={() => setSection(name as Section)}
                   >
                     Go to {name} ↗
                   </button>
                 </div>
               </div>

               <div className="v3-stage-checks-list">
                 {stg.checks.map((chk: ReviewCheckItem) => {
                   const chkBadge = getCheckItemBadge(chk.status);
                   return (
                     <div key={chk.id} className={`v3-check-item item-${chk.status}`}>
                       <div className="v3-check-header">
                         <div className="v3-check-title-row">
                           {chk.status === 'passed' && <CheckCircle2 size={16} color="#15803d" />}
                           {chk.status === 'failed' && <AlertCircle size={16} color="#be123c" />}
                           {chk.status === 'warning' && <AlertCircle size={16} color="#b45309" />}
                           {chk.status === 'pending' && <Clock size={16} color="#64748b" />}
                           <span>{chk.title}</span>
                         </div>
                         <span className={`v3-check-badge ${chkBadge.className}`}>{chkBadge.label}</span>
                       </div>

                       {chk.description && <div className="v3-check-desc">{chk.description}</div>}

                       {((chk.studentValue !== undefined && chk.studentValue !== '') || chk.expectedRequirement || chk.whyIncorrect || chk.conceptToRevisit) && (
                         <div className="v3-diagnosis-box">
                           {chk.studentValue !== undefined && chk.studentValue !== '' && (
                             <div className="v3-diag-row">
                               <span className="v3-diag-label">What you entered:</span>
                               <span className="v3-diag-val-student">{String(chk.studentValue)}</span>
                             </div>
                           )}
                           {chk.expectedRequirement && (
                             <div className="v3-diag-row">
                               <span className="v3-diag-label">Expected requirement:</span>
                               <span className="v3-diag-val-expected">{chk.expectedRequirement}</span>
                             </div>
                           )}
                           {chk.whyIncorrect && (
                             <div className="v3-diag-row">
                               <span className="v3-diag-label">Why this needs revision:</span>
                               <span className="v3-diag-val-why">{chk.whyIncorrect}</span>
                             </div>
                           )}
                           {chk.conceptToRevisit && (
                             <div className="v3-diag-row">
                               <span className="v3-diag-label">Revisit concept:</span>
                               <span className="v3-diag-val-concept">{chk.conceptToRevisit}</span>
                             </div>
                           )}
                           <div className="v3-diag-action-row">
                             <button
                               type="button"
                               className="v3-action-mini-btn"
                               onClick={() => setSection(chk.actionTab as Section)}
                             >
                               Return to {chk.actionTab} to Revise <ArrowRight size={13} />
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
             </div>
           );
         })}
       </div>

       {/* 3. Formative Assessment Rubric */}
       <div className="v3-panel">
         <div className="v3-panel-head-flex">
           <h3>Assessment Rubric · 10 Points</h3>
           <span className="v3-rubric-badge">10 Points Total</span>
         </div>
         <div className="v3-rubric">
           {lesson.rubric.map((r, i) => (
             <div key={i}>
               <strong>{r.name} <span>{r.points}/10</span></strong>
               <p>{r.evidence}</p>
             </div>
           ))}
         </div>
       </div>

       {/* 3. Pre-Handover Checklist */}
       <div className="v3-panel">
         <div className="v3-panel-head-flex">
           <h3>Before Handover Verification</h3>
           <span className="v3-check-count">
             {lesson.beforeSubmission.filter((_, i) => draft[`check:${i}`] === 'yes').length} of {lesson.beforeSubmission.length} Verified
           </span>
         </div>
         <div className="v3-checks">
           {lesson.beforeSubmission.map((check, i) => (
             <label key={i} className={`v3-check-row ${draft[`check:${i}`] === 'yes' ? 'is-checked' : ''}`}>
               <input
                 type="checkbox"
                 checked={draft[`check:${i}`] === 'yes'}
                 onChange={e => update(`check:${i}`, e.target.checked ? 'yes' : 'no')}
               />
               <span>{check}</span>
             </label>
           ))}
         </div>
       </div>

       {/* 4. My Saved Work — In-Platform Responses */}
       <div className="v3-panel">
         <div className="v3-panel-head-flex">
           <h3>My Saved Work Summary</h3>
           <span className="v3-rubric-badge">In-Platform Record</span>
         </div>
         <div className="v3-my-work-grid">
           <div className="v3-my-work-card">
             <div className="v3-my-work-card-head">
               <h4>Stage 02 · Concept Explanation</h4>
               <button type="button" className="v3-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSection('Learn')}>Edit in Learn ↗</button>
             </div>
             <div className={`v3-my-work-content ${!draft['concept:explain'] ? 'v3-my-work-empty' : ''}`}>
               {draft['concept:explain'] || 'No concept explanation entered yet. Complete Stage 02 (Learn) to draft your explanation.'}
             </div>
           </div>

           <div className="v3-my-work-card">
             <div className="v3-my-work-card-head">
               <h4>{selected === 1 ? 'Stage 04 · Startup Launch Canvas Output' : 'Stage 04 · Practical Calculations & Workstation Output'}</h4>
               <button type="button" className="v3-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSection('Work')}>Edit in Work ↗</button>
             </div>
             <div className="v3-my-work-content">
               {selected === 1 ? (
                 <div>
                   <p style={{ fontWeight: 600, color: '#0e746c', marginBottom: '6px' }}>
                     ✓ Startup Founder Lab & Launch Canvas Configured
                   </p>
                   <p style={{ fontSize: '12.5px', color: '#475569' }}>
                     Your 5 founder decisions and live 8-block Startup Launch Canvas are preserved in this browser session.
                   </p>
                   {draft['work:analysis'] && (
                     <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                       <strong>Compiled Canvas Record:</strong>
                       <p style={{ marginTop: '4px', whiteSpace: 'pre-line', color: '#1e293b' }}>{draft['work:analysis']}</p>
                     </div>
                   )}
                 </div>
               ) : selected <= 7 ? (
                 <div>
                   <p style={{ fontWeight: 600, color: '#0e746c', marginBottom: '6px' }}>
                     ✓ Interactive Workstation Configured for Session {padded(selected)}
                   </p>
                   <p style={{ fontSize: '12.5px', color: '#475569' }}>
                     Your subject-specific workstation calculations, tables, and reconciliations are actively preserved in this browser session.
                   </p>
                   {draft['work:analysis'] && (
                     <p style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                       <strong>Decision Notes:</strong> {draft['work:analysis']}
                     </p>
                   )}
                 </div>
               ) : (
                 <div>
                   {lesson.workPrompts.map((prompt, i) => (
                     <div key={i} style={{ marginBottom: i < lesson.workPrompts.length - 1 ? '10px' : 0 }}>
                       <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>{prompt}:</span>
                       <span>{draft[`work-prompt:${i}`] || <span className="v3-my-work-empty">Not answered</span>}</span>
                     </div>
                   ))}
                   {draft['work:analysis'] && (
                     <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                       <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>Analysis Notes:</span>
                       <span>{draft['work:analysis']}</span>
                     </div>
                   )}
                   {!lesson.workPrompts.some((_, i) => draft[`work-prompt:${i}`]) && !draft['work:analysis'] && (
                     <span className="v3-my-work-empty">No workstation inputs entered yet. Complete Stage 04 (Work) to record your responses.</span>
                   )}
                 </div>
               )}
             </div>
           </div>

           <div className="v3-my-work-card">
             <div className="v3-my-work-card-head">
               <h4>{selected === 1 ? 'Stage 05 · Boardroom Simulation & Crisis Remediation' : 'Stage 05 · Squad Review & Judgement'}</h4>
               <button type="button" className="v3-outline" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSection('Team')}>Edit in Team ↗</button>
             </div>
             <div className="v3-my-work-content">
               <div style={{ marginBottom: '8px' }}>
                 <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>Individual Contribution:</span>
                 <span>{draft['team:contribution'] || <span className="v3-my-work-empty">No contribution notes recorded.</span>}</span>
               </div>
               <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                 <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block' }}>Autonomous Decision:</span>
                 <span>{draft['team:judgement'] || <span className="v3-my-work-empty">No autonomous decision recorded.</span>}</span>
               </div>
             </div>
           </div>

           <div className="v3-my-work-card">
             <div className="v3-my-work-card-head">
               <h4>Stage 06 · Habit Reflection</h4>
             </div>
             {writeField('review:reflection', 'What I can now do independently, and what habit I need to strengthen')}
           </div>
         </div>
       </div>

       {/* 5. In-Platform Action Bar (No File Downloads) */}
       <div className="v3-action-bar">
         {student ? (
           <a className="v3-primary" href={`/?session=${selected}`}>
             Open Assessed Workspace to Submit <IconArrow />
           </a>
         ) : user ? (
           <a className="v3-primary" href="/">
             Return to Session Lab <IconArrow />
           </a>
         ) : (
           <a className="v3-primary" href={`/signin?return_to=${encodeURIComponent(`/guided-learning?session=${selected}`)}`}>
             Sign In to Submit for Faculty Review <IconArrow />
           </a>
         )}
         <a className="v3-outline" href="/">
           Return to Course Catalogue
         </a>
       </div>
     </>}
    </div>
   ))}

   <footer className="v3-footer"><div><strong>VCEP · Vayentra Ventures</strong><p>Simulation-based learning. Evidence over claims.</p></div><div><span>Practice data remains in this browser tab, not the official database.</span><button type="button" className="v3-link-danger" onClick={clearDraft}>{clearArmed?'Confirm clear draft':'Clear practice draft'}</button>{clearArmed&&<button type="button" className="v3-cancel" onClick={()=>setClearArmed(false)}>Cancel</button>}</div></footer>
  </main></div>
 </div>;
}
