import test from 'node:test';
import assert from 'node:assert/strict';
import {schools} from '../data.js';
import {filterJobs,cleanApplications,reportUrl,applicationLink,levels,curricula} from '../job-tools.js';
test('combined level, curriculum, radius and application filters keep only matching campuses',()=>{
 const origin={lat:3.179,lng:101.548};
 assert.deepEqual(filterJobs(schools,{level:'Sixth form',curriculum:'British',radius:'5',status:'Applied'},origin,{help:'Applied',mkis:'Applied'}).map(s=>s.id),['help']);
 assert.ok(filterJobs(schools,{radius:'5'},origin,{}).every(s=>s.lat!==null));
 assert.equal(filterJobs(schools,{radius:'5'},null,{}).length,schools.length);
 assert.ok(filterJobs(schools,{level:'Secondary'},null,{}).some(s=>s.id==='help'));
});
test('application restore validates IDs and statuses and accepts old backups',()=>{
 assert.deepEqual(cleanApplications({help:'Applied',nexus:'Interview',unknown:'Offer',mkis:'bad'},schools),{help:'Applied',nexus:'Interview'});
 assert.deepEqual(cleanApplications(undefined,schools),{});
 assert.deepEqual(cleanApplications(['Applied'],schools),{});
});
test('report draft preserves punctuation and never submits automatically',()=>{
 const s=schools.find(s=>s.id==='help');const url=new URL(reportUrl(s,'Contact / email','A & B\nCorrection','https://example.com/?a=1&b=2'));
 assert.equal(url.origin,'https://github.com');assert.equal(url.pathname,'/nahiphog/InternationalSchoolsHere/issues/new');
 assert.ok(url.searchParams.get('body').includes('A & B\nCorrection'));
});
test('new school metadata retains evidence and missing careers links remain missing',()=>{
 assert.equal(applicationLink({contactSource:'https://example.com/contact'}),'');
 assert.ok(applicationLink(schools.find(s=>s.id==='help')).includes('careers'));
 assert.ok(curricula({curriculum:'British / IPC'}).includes('IPC'));
 for(const s of schools){assert.ok(levels(s).length);if(s.teachingLevels)assert.ok(s.levelSource.startsWith('https://'));if(s.requirements){assert.ok(s.requirements.source.startsWith('https://'));assert.match(s.requirements.checked,/^\d{4}-\d{2}-\d{2}$/);}}
});
