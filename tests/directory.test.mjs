import test from 'node:test';
import assert from 'node:assert/strict';
import {schools} from '../data.js';
import {filterSchools,distanceKm,isRecruitment,csv,escapeHtml} from '../core.js';
import {project,unproject} from '../map.js';
const defaults={query:'',region:'',area:'',subject:'',contact:'',sort:'name',secondary:false,saved:false};
test('directory has unique IDs, supported regions, and evidence for every email, subject list and exact coordinate',()=>{
 assert.equal(new Set(schools.map(s=>s.id)).size,schools.length);
 for(const s of schools){assert.ok(['Selangor','Kuala Lumpur','Putrajaya'].includes(s.state),s.id);assert.ok(s.locationSource.startsWith('https://'),s.id);if(s.email){assert.match(s.email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/);assert.ok(s.contactSource.startsWith('https://'));}if(s.subjects.length)assert.ok(s.subjectSource.startsWith('https://'),s.id);if(s.discovery)assert.equal(s.lat,null);if(s.coordinateSource)assert.ok(Number.isFinite(s.lat)&&Number.isFinite(s.lng));}
});
test('primary focus excludes secondary campuses; combined filters find a sourced primary role contact',()=>{
 assert.ok(filterSchools(schools,defaults).every(s=>s.primary));
 const result=filterSchools(schools,{...defaults,query:'HELP',region:'Selangor',subject:'Science',contact:'recruitment'});
 assert.deepEqual(result.map(s=>s.id),['help']);
 const putrajayaScience=filterSchools(schools,{...defaults,region:'Putrajaya',subject:'Science'});
 assert.ok(putrajayaScience.some(s=>s.id==='nexus'));
 assert.ok(putrajayaScience.every(s=>s.state==='Putrajaya'&&s.subjects.includes('Science')));
 assert.ok(filterSchools(schools,{...defaults,secondary:true}).some(s=>!s.primary));
});
test('saved view respects filters and unconfirmed email filter never treats a fallback as HR',()=>{
 const saved=new Set(['nexus','help']);assert.equal(filterSchools(schools,{...defaults,saved:true},saved).length,2);
 assert.deepEqual(filterSchools(schools,{...defaults,saved:true,region:'Putrajaya'},saved).map(s=>s.id),['nexus']);
 assert.ok(filterSchools(schools,{...defaults,contact:'recruitment'}).every(isRecruitment));
 assert.ok(filterSchools(schools,{...defaults,contact:'missing'}).every(s=>!s.email));
});
test('distance sorting uses haversine distance and puts records without pins last',()=>{
 assert.equal(distanceKm({lat:3,lng:101},{lat:3,lng:101}),0);
 assert.ok(Math.abs(distanceKm({lat:0,lng:0},{lat:0,lng:1})-111.195)<.01);
 const sorted=filterSchools(schools,{...defaults,sort:'distance'},new Set(),{lat:2.941,lng:101.727});
 assert.equal(sorted[0].id,'nexus');const lastPin=sorted.findLastIndex(s=>Number.isFinite(s.lat));assert.ok(sorted.slice(lastPin+1).every(s=>s.lat===null));
});
test('map projection round-trips at every supported zoom',()=>{for(let z=8;z<=17;z++){const p=project(3.1478,101.694,z),q=unproject(p.x,p.y,z);assert.ok(Math.abs(q.lat-3.1478)<1e-8);assert.ok(Math.abs(q.lng-101.694)<1e-8);}});
test('CSV keeps commas, newlines, quotes, and Unicode data intact',()=>{
 assert.equal(csv([['Name','Notes'],['École, KL','A "quote"\nand newline']]),'\uFEFF"Name","Notes"\r\n"École, KL","A ""quote""\nand newline"');
 assert.equal(escapeHtml('<a href="x">&\''),'&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});
