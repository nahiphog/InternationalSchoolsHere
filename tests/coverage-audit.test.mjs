import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {schools} from '../data.js';
import {coverageAdditions} from '../coverage-additions.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const audit=read('../research/coverage-audit-2026-10-31.json');
const inventory=read('../research/coverage-source-inventory-2026-10-31.json');
test('coverage audit accounts for every captured source profile and all added campuses',()=>{
 const urls=new Set(inventory.flatMap(p=>p.links.map(l=>new URL(l.url,p.url).href)));
 assert.equal(audit.candidates.length,urls.size);
 assert.deepEqual(new Set(audit.candidates.map(c=>c.url)),urls);
 for(const c of audit.candidates){
  assert.ok(['already_present','added_or_expanded','excluded','unresolved'].includes(c.disposition));
  assert.ok(c.reason);
  for(const id of c.campusIds||[])assert.ok(schools.some(s=>s.id===id),id);
 }
 assert.deepEqual(new Set(audit.addedCampusIds),new Set(coverageAdditions.map(s=>s.id)));
 assert.equal(audit.summary.addedCampuses,coverageAdditions.length);
 for(const s of coverageAdditions){
  assert.equal(typeof s.primary,'boolean',s.id);
  assert.equal(s.lat,null,s.id);
  assert.equal(s.lng,null,s.id);
  if(s.primary&&!s.subjects.length)assert.ok(s.subjectResearchNote,s.id);
 }
});
test('research coverage totals stay consistent with the visible directory',()=>{
 const {coverage}=read('../research-status.json');
 assert.equal(coverage.campusRecords,schools.length);
 assert.equal(coverage.primaryCampuses,schools.filter(s=>s.primary).length);
 assert.equal(coverage.publicEmails,schools.filter(s=>s.email).length);
 assert.equal(coverage.recruitmentOrHrEmails,schools.filter(s=>s.email&&['HR','Recruitment'].includes(s.contactKind)).length);
 assert.equal(coverage.primarySubjectLists,schools.filter(s=>s.primary&&s.subjects.length).length);
});
