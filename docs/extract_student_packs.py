"""Generate student-safe VCEP Edition 3 structured curriculum from 24 student DOCX packs.
Usage: python docs/extract_student_packs.py '/path/to/student-docx-folder'
Requires python-docx. Do not feed trainer master books or controlled assessments.
"""
import json,sys,re,glob
from pathlib import Path
from docx import Document
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

folder=Path(sys.argv[1] if len(sys.argv)>1 else '/mnt/data')
out=Path(__file__).resolve().parents[1]/'app/guided-learning/drive-edition-3.json'

def clean(s):return re.sub(r'\s+',' ',s.replace('\xa0',' ')).strip()

def extract(file):
    d=Document(file)
    ps=d.paragraphs
    text=lambda n:clean(ps[n].text)
    id=int(re.search(r'S(\d+)_',file.name).group(1))
    assert text(0).startswith('Session')
    row={"id":id,"title":text(1),"edition":"Drive Student Pack 3.0","minutes":135}
    row['outcome']=text(4).removeprefix('Session outcome').strip()
    row['deliverable']=text(5).removeprefix('Submit').split('Keep your individual working file')[0].strip().rstrip('.')
    row['case']=text(7)
    row['concept']=text(9)
    row['example']=text(10).removeprefix('Small worked example').strip()
    row['assignment']=text(12)
    row.update(sourceTables=[],workTables=[],workPrompts=[],support=[],beforeSubmission=[],rubric=[],squad='',reviewRoles='',aiPrompt='',aiPolicy='',submission='',reflection='What I can now do and what I still need to practise')
    mode='intro';last=[];record=[]
    ignored={'Your working sheets','Working sheets continued','SESSION','Team review and AI record','Submission and assessment','Questions to clarify before you begin'}
    for e in d.element.body.iterchildren():
        if e.tag == qn('w:p'):
            p=clean(Paragraph(e,d).text)
            if not p or p.startswith('_____') or p.startswith('Student ID') or re.fullmatch(r'SESSION \d+',p):continue
            if p in ['SOURCE RECORDS','Your working sheets','Working sheets continued','Team review and AI record','Submission and assessment']:
                mode={'SOURCE RECORDS':'source','Your working sheets':'work','Working sheets continued':'work2','Team review and AI record':'team','Submission and assessment':'review'}[p]
                last=[];continue
            if p=='Supporting brief':mode='support';continue
            if p=='Squad activity':record=['squad'];continue
            if p.startswith('Review roles  '):row['reviewRoles']=p.replace('Review roles  ','',1);record=[];continue
            if p=='Optional AI practice after your first attempt':record=['ai'];continue
            if p=='Independent assessment conditions':record=['aiPolicy'];continue
            if p=='Before submission':record=['checklist'];continue
            if p=='One judgement I must make myself':record=[];continue
            if p=='My contribution and one correction from peer review':record=[];continue
            if p.startswith('Name your files '):row['submission']=p;record=[];continue
            if p=='What I can now do and what I still need to practise':record=[];continue
            if p.startswith('Faculty only') or p.startswith('Faculty feedback'):record=[];continue
            if record:
                if record[0]=='squad':row['squad']=p;record=[];continue
                if record[0]=='ai':row['aiPrompt']=p;record=['aiGuideline'];continue
                if record[0]=='aiGuideline':row['aiPolicy']=p;record=[];continue
                if record[0]=='aiPolicy':row['aiPolicy']=p;record=[];continue
                if record[0]=='checklist' and re.match(r'^\[\s*\]',p):row['beforeSubmission'].append(re.sub(r'^\[\s*\]\s*','',p));continue
                if record[0]=='checklist':record=[]
            if mode=='support' and p not in ('Questions to clarify before you begin',):
                if p.startswith('Questions to clarify'):mode='support_done'
                else:row['support'].append(p)
            if mode in ('work','work2'):
                if len(p)<120 and p not in ignored and p not in ('Scheduled session: 135 minutes',):row['workPrompts'].append(p)
            if mode=='source' and p not in ignored:last.append(p)
            if mode in ('work','work2'):last=[p]
        elif e.tag == qn('w:tbl'):
            t=Table(e,d)
            cells=[[clean(c.text) for c in rr.cells] for rr in t.rows]
            if not cells:continue
            if cells[0][0]=='AI record field':row['aiLogFields']=[r[0] for r in cells[1:]];continue
            if cells[0][0]=='Criterion':row['rubric']=[{'name':r[0],'points':int(r[1]) if r[1].isdigit() else 0,'evidence':r[2]} for r in cells[1:]];continue
            if mode=='source':
                row['sourceTables'].append({'title':last[-2] if len(last)>1 else 'Source records','note':last[-1] if last else '', 'headers':cells[0],'rows':cells[1:]})
            else:
                title=last[-1] if last else 'Working table'
                row['workTables'].append({'title':title,'headers':cells[0],'rows':cells[1:]})
            last=[]
    row['workPrompts']=list(dict.fromkeys([x for x in row['workPrompts'] if x not in ('Working schedule','Working sheets continued') and x not in [t['title'] for t in row['workTables']]]))
    row['support']=[x for x in row['support'] if x not in ('Questions to clarify before you begin',)]
    summaries={
      1:'Explain why a profitable business can still run short of cash.',
      2:'Introduce yourself professionally and make verifiable teamwork commitments.',
      3:'Clarify vague requests and communicate business risks without guessing.',
      4:'Run purposeful meetings and record decisions, owners and deadlines.',
      5:'Turn source documents into correct journal entries with evidence.',
      6:'Close accounts, correct ledger errors and validate financial statements.',
      7:'Clean messy records without losing evidence or hiding exceptions.',
      8:'Reconcile book and bank balances using supported adjustments.',
      9:'Evaluate growth, margins and receivables using verified figures.',
      10:'Build a dashboard that helps managers make better decisions.',
      11:'Review invoices and tax calculations using supplied case assumptions.',
      12:'Prioritise collections and forecast cash without assuming promised payments.',
      13:'Prepare safe AI inputs and verify business analysis.',
      14:'Detect unsupported AI claims and build approval checkpoints.',
      15:'Manage leads, conversion metrics and timely sales follow-ups.',
      16:'Compare discounts, contribution and capacity before recommending prices.',
      17:'Interview stakeholders and define a measurable business problem.',
      18:'Plan a feasible solution with owners and acceptance tests.',
      19:'Build and test a prototype using traceable business records.',
      20:'Handle approved changes without destroying earlier versions or evidence.',
      21:'Turn genuine project evidence into honest resume achievements.',
      22:'Demonstrate independent ability through a controlled assessment and interview.',
      23:'Prepare a credible business demonstration backed by tested evidence.',
      24:'Defend your work and audit your competency record.'
    }
    row['summary']=summaries[id]
    row['track']=(id-1)//6+1
    row['controlledAssessment']=id in (1,22)
    if id==22:
        row['aiPrompt']=''
        row['aiPolicy']='No AI or peer help during the independent Exit B assessment or individual interview.'
    row['sourceLink']='https://drive.google.com/drive/folders/1dA03jJHeRJ_MGe1I80LpEz4KL0xo80GB'
    return row

files=sorted(folder.glob('S[0-9][0-9]_*.docx'))
items=[extract(x) for x in files]
assert len(items)==24,[x['id'] for x in items]
assert [v['id'] for v in items]==list(range(1,25))
assert all(x['rubric'] for x in items)
assert all(sum(y['points'] for y in x['rubric'])==10 for x in items)
out.write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
print('Built:',out,'bytes',out.stat().st_size)
for v in items:print(f"{v['id']:02d} {v['title'][:34]:34} src={len(v['sourceTables'])} work={len(v['workTables'])} prompts={len(v['workPrompts'])} squad={bool(v['squad'])} ai={bool(v['aiPrompt'])} support={len(v['support'])}")
