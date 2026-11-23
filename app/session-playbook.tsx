'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, FileText, Lightbulb } from 'lucide-react';
import './session-playbook.css';

type Source = { title: string; description?: string; kind?: string; heads?: string[]; rows?: unknown[][] };
type Session = {
  id: number; title: string; outcome?: string; company?: string; case?: string;
  concept?: string; example?: string; task?: string; evidence?: string;
  ai?: string; stretch?: string; sources?: Source[];
  lab?: { title?: string; roles?: string[]; win?: string; minutes?: number };
};

type Stage = { step: string; range: string; duration: number; title: string; type: string; instructions: string[] };

function getStages(s: Session): Stage[] {
  const simulated = s.sources?.find(x => x.kind === 'simulation');
  return [
    { step: '01',range:'00–05',duration:5,title:'Cold open: make the call',type:'Individual',instructions:[
      `Present the central problem in “${s.title}” without solving it.`,
      'Ask students to state one decision, one risk and the fact they would need before acting.',
      'Capture a quick baseline response; return to it at the end of the class.'
    ]},
    { step: '02',range:'05–20',duration:15,title:'Concept clinic and worked example',type:'Guided',instructions:[
      s.concept || 'Explain the central business principle and define the key terms.',
      s.example || 'Work through one short example on a whiteboard or spreadsheet.',
      'Ask a student to explain the reasoning in plain English, not just repeat the formula.'
    ]},
    { step: '03',range:'20–40',duration:20,title:'Evidence investigation',type:'Data lab',instructions:[
      simulated ? `Open the classroom dataset: “${simulated.title}”. Identify what each column means.` : 'Read the case sources and identify the evidence needed for the decision.',
      'Distinguish published company context from fictional teaching data; do not combine unrelated figures.',
      'Highlight missing information, misleading assumptions, and two figures that influence the recommendation.'
    ]},
    { step: '04',range:'40–65',duration:25,title:'Individual analyst workstation',type:'Hands-on',instructions:[
      s.task || 'Complete the individual evidence-based worksheet.',
      'Complete the original short task first, then stress-test your answer with one changed assumption.',
      'Prepare a 3-line management note: recommendation, supporting number, and main risk.'
    ]},
    { step: '05',range:'65–80',duration:15,title:'Squad decision room',type:'Teamwork',instructions:[
      `Run the existing squad simulation${s.lab?.title ? `: “${s.lab.title}”` : ''}.`,
      `Allocate roles: ${s.lab?.roles?.join('; ') || 'analyst, operations lead, reviewer and decision-maker'}.`,
      'Disagree constructively, reveal the surprise in the original Squad & AI Lab, and agree on a revised decision.'
    ]},
    { step: '06',range:'80–95',duration:15,title:'AI critic and verification',type:'AI practice',instructions:[
      s.ai || 'Ask an approved AI tool to challenge the team conclusion, not to invent an answer.',
      'Mark each AI claim as verified, unsupported or contradicted using the supplied case evidence.',
      'Document one material correction and a safer revised statement. Offer a teammate-as-AI fallback.'
    ]},
    { step: '07',range:'95–110',duration:15,title:'Boardroom pitch and peer challenge',type:'Communication',instructions:[
      'Each team delivers a 60-second business recommendation, naming evidence, trade-off and next action.',
      'Peer teams challenge one assumption, one calculation and one implementation risk.',
      'Revise the recommendation after the challenge. The facilitator judges reasoning rather than volume or confidence alone.'
    ]},
    { step: '08',range:'110–120',duration:10,title:'Exit ticket and evidence handover',type:'Reflection',instructions:[
      `Record the actual evidence: ${s.evidence || 'completed worksheet and management recommendation'}.`,
      'Explain one concept in your own words; name one mistake corrected during the exercise.',
      'Export the practice notes. If enrolled, use the separate assessed worksheet for official submission.'
    ]}
  ];
}

export default function SessionPlaybook({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const stages = getStages(session);
  return <section className="vcep-playbook" aria-labelledby="vcep-playbook-title">
    <div className="vcep-playbook-head">
      <div className="vcep-playbook-head-copy">
        <span className="vcep-playbook-kicker"><Clock3 size={14}/> EXTENDED CLASSROOM EDITION</span>
        <h2 id="vcep-playbook-title">Your 120-minute corporate workshop</h2>
        <p>Eight connected stages turn the short individual task into a full instructor-led lesson. Use the same business case and datasets already in VCEP.</p>
        <button className="vcep-playbook-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="vcep-playbook-content">
          {open ? 'Close teaching plan' : 'Explore the full teaching plan'} <ArrowRight size={16}/>
        </button>
      </div>
      <div className="vcep-playbook-time"><strong>120</strong><span>MINUTES</span><small>8 work stages</small></div>
    </div>
    {open && <div id="vcep-playbook-content" className="vcep-playbook-content">
      <div className="vcep-playbook-intro"><Lightbulb size={17}/><p><b>Facilitator note:</b> This is an additional class-delivery guide, not a replacement for the original 10–15-minute assessed worksheet. Students can complete the rest as group activities, whiteboard work and local practice.</p></div>
      <ol className="vcep-playbook-stages">
        {stages.map(stage=><li key={stage.step} className="vcep-playbook-stage">
          <div className="vcep-playbook-number">{stage.step}</div>
          <div className="vcep-playbook-stage-body">
            <div className="vcep-playbook-stage-title"><h3>{stage.title}</h3><span>{stage.range} min · {stage.type}</span></div>
            <ul>{stage.instructions.map((instruction,j)=><li key={j}>{instruction}</li>)}</ul>
          </div>
        </li>)}
      </ol>
      {session.id === 1 && <div className="vcep-playbook-example">
        <span className="vcep-playbook-kicker"><FileText size={14}/> SESSION 01 / EXTRA BUSINESS SIMULATION</span>
        <h3>The liquidity decision desk</h3>
        <p>The classroom distributor reports ₹6,00,000 revenue and ₹4,70,000 expenses, but collections and payments happened on different dates. Can it safely pay an ₹80,000 van deposit?</p>
        <div className="vcep-playbook-ledger">
          <div><small>Opening bank</small><strong>₹80,000</strong></div>
          <div><small>Cash collected</small><strong>₹3,90,000</strong></div>
          <div><small>Cash paid</small><strong>₹4,20,000</strong></div>
          <div><small>Minimum reserve</small><strong>₹40,000</strong></div>
        </div>
        <div className="vcep-playbook-challenge"><b>Two decisions, not one</b><p>First calculate recognised profit, closing bank and cash above reserve. Then consider a new offer: a retailer pays ₹60,000 immediately if granted a 2% discount. Does the deposit become affordable after the offer?</p>
          <details><summary>Show worked-solution checks (for practice and facilitator review)</summary><p><b>Baseline:</b> profit ₹1,30,000; closing bank ₹50,000; cash above reserve ₹10,000. The ₹80,000 deposit cannot be paid while maintaining the reserve.</p><p><b>Discount offer:</b> net receipt ₹58,800; updated bank ₹1,08,800; cash above reserve ₹68,800. The deposit is still ₹11,200 above available cash. Defer or seek a confirmed alternative; don't invent collections.</p></details>
        </div>
        <p className="vcep-playbook-source-note">All operating figures above are fictional classroom records. The named real company is only a separate learning reference.</p>
      </div>}
      <div className="vcep-playbook-finish"><CheckCircle2 size={19}/><span>Class completion standard: a justified answer, a checked calculation, one peer challenge, an AI verification note and a short reflective handover.</span></div>
    </div>}
  </section>;
}
