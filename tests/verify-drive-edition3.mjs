/** Run from existing VCEP repository root: node tests/verify-drive-edition3.mjs */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const list=JSON.parse(fs.readFileSync('app/guided-learning/drive-edition-3.json','utf8'));
assert.equal(list.length,24,'Expected exactly 24 student modules');
for(let i=0;i<24;i++){
 const s=list[i];
 assert.equal(s.id,i+1,`Wrong session order at index ${i}`);
 for(const k of ['title','outcome','summary','deliverable','case','concept','example','assignment','squad','submission']){
  assert.equal(typeof s[k],'string',`S${s.id}: ${k} missing`);
  assert.ok(s[k].length>15,`S${s.id}: ${k} too short`);
 }
 assert.equal(s.edition,'Drive Student Pack 3.0');
 assert.equal(s.minutes,135);
 assert.ok(Array.isArray(s.sourceTables));
 assert.ok(Array.isArray(s.workTables));
 assert.ok(Array.isArray(s.beforeSubmission));
 assert.equal(s.beforeSubmission.length,5,`S${s.id}: workbook checklist should have 5 entries`);
 assert.equal(s.rubric.reduce((sum,r)=>sum+r.points,0),10,`S${s.id}: rubric not /10`);
 for(const t of [...s.sourceTables,...s.workTables]){
  assert.ok(t.headers.length>1,`S${s.id}: invalid table headings`);
  assert.ok(t.rows.every(r=>r.length===t.headers.length),`S${s.id}: invalid row length`);
 }
}
assert.equal(list[0].controlledAssessment,true);
assert.equal(list[21].controlledAssessment,true);
assert.equal(list[21].aiPrompt,'','S22: controlled assessment must not have an AI prompt');
assert.ok(list[6].sourceTables.some(t=>t.rows.some(r=>r.includes('R02'))),'S07: Case B records missing');
assert.ok(list[10].sourceTables.some(t=>t.rows.some(r=>r.includes('E02'))),'S11: Case E invoice source missing');
console.log('PASS: 24 student sessions, 135-minute metadata, curriculum fields, source/work tables, /10 rubric and assessment guards.');
