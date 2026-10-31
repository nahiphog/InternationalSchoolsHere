// Rebuild the dated audit ledger from the captured source inventory and reviewed identity rules.
// Rules identify source entries, not proof of current operation; field evidence lives in each campus record.
import fs from 'node:fs';
import { schools } from '../data.js';
import { coverageAdditions } from '../coverage-additions.js';
const root = new URL('../', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const write = (p,v) => fs.writeFileSync(new URL(p,root),JSON.stringify(v,null,2)+'\n');
const inventory = read('research/coverage-source-inventory-2026-10-31.json');
const mappings = `
international school of kuala lumpur=iskl
alice smith=alice-primary,alice-secondary
parkcity=parkcity
mont kiara international=mkis
garden international=garden
igb international=igbis
help international=help
elc international school cyberjaya=elc-cj
elc international=elc-sb,elc-cj
nexus=nexus
australian international=aism
acmar=acmar
mahsa=mahsa
kingsgate=kingsgate
fairview international school subang=fairview-sj
fairview=fairview-kl,fairview-sj
st joseph=sji
sri kdu international school klang=kdu-klang
sri kdu international school subang=kdu-sj
sri kdu=kdu-kd
british international=bskl
asia pacific=aps
kingsley=kingsley
sayfol=sayfol
havil=havil
sri bestari=bestari
nobel=nobel
mutiara=mutiara
reigate=reigate
straits=straits
concord=concord
oasis international=oasis
peninsula=peninsula
german school=dskl
french school|lycee francais=lfkl,lfkl-hevea
cempaka international school damansara|cempaka international school kuala=cempaka
honsbridge=honsbridge
sri kuala lumpur=sr kl
sanctus=sanctus
tenby.*setia eco park=tenby-sep
tenby.*setia ecohill=tenby-seh
tenby.*tropicana=tenby-ta
taylor s international school puchong=tis-pc
taylor s international=tis-kl
dwi emas=dwi
sri emas=sriemas
sunway international=sunway
idrissi.*bukit jelutong=idrissi-bj
idrissi=idrissi-sa
collinz=collinz-klang,collinz-gl
inspiros=inspiros-pc,inspiros-klang
heritage=heritage
axcel=axcel
maz international=maz-pj,maz-sa
global indian=giis
arrows=arrows
abedeen=abedeen
al hamra=alhamra
beverly=beverly
brainy bunch=brainy
canary=canary
chinese taipei=taipei
columbia=columbia
emerald gardens=emerald
global modern=globalmodern
global oak tree|gots international=gots
good school=good
greenview=greenview-sa,greenview-bangi
harvest=harvest
^his international=his-subang
hua xia=huaxia
icons=icons
mitstem=mitstem
oakbridge=oakbridge
oxburgh=oxburgh
reed=reed
regent=regent
saint international=saint
sasana=sasana
ucsi international school subang=ucsi-sj
ucsi international=ucsi-kl,ucsi-sj
victoria=victoria
wisdom spring=wisdomspring
international islamic school malaysia=iism
^ais international|alnoor=ais
aspiration international secondary=aspiration-secondary
aspiration=aspiration,aspiration-secondary
brighton=brighton
campus rangers=campusrangers
cranbridge=cranbridge
hibiscus=hibiscus
kys kl=kys
marefat=marefat
primrose=primrose
dasmesh=dasmesh
sempurna=sempurna
sri utama|utama international=utama
st john=stjohn,stjohn-secondary
ardence=ardence
finnlight=finnlight
global ark=globalark
maverick international primary=maverick-primary
maverick=maverick,maverick-primary
mindrich=mindrich
frontier=frontier
tls international=tls
charterhouse=charterhouse
beaconhouse sri inai|^beaconhouse school$=beaconhouse
seven skies=seven-skies
king henry=kh8
tzu chi=tzuchi
spectrum=spectrum-kl,spectrum-putrajaya
baseerah=baseerah
eaton=eaton-kajang,eaton-sa
eagles=eagles
lexel=lexel-gardens,lexel-cove
templer=templer
stars international=stars
suria international=suria
tanarata=tanarata
qosmo=qosmo
pine hills=pine-kl,pine-sj,pine-sa
kingsway=kingsway
portman=portman
prime international=prime
knewton=knewton-rawang
stellaire=stellaire
stella maris=stella-maris
tree top=treetop
vikas=vikas
international modern arabic=imas-putrajaya,imas-kl,imas-uniten
rocklin=rocklin
orbix=orbix-klang
korean school=korean
japanese school=japanese
cheltenham=cheltenham
winz=winz
summer international=summer
sri desa=sri-desa
rafflesia international=rafflesia-puchong
valley international=valley
kueen lai=kueen-lai
sekolah indonesia=indonesia
wesley methodist schools international private|wesley methodist school kuala=wesley-kl
`.trim().split('\n').map(l=>{const [pattern,ids]=l.split('=');return {pattern:new RegExp(pattern),ids:ids.split(',')};});
const norm = s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const excluded = [
 [/kolej tuanku|epsom|adcote matrix|soka international|ucsi.*springhill|nilai international|zenith.*seremban|kolej tunku kurshiah/,'Outside Kuala Lumpur, Putrajaya and Selangor; the broader city guide also lists Negeri Sembilan schools.'],
 [/real schools|r e a l international/,'Historical international listing conflicts with current official Shah Alam/Cheras pages describing national programmes. Not added as a verified current international campus.'],
 [/sekolah sri ucsi|sekolah tinta|sri rafelsia|beaconhouse sri lethia|beaconhouse sri murni|wesley.*klang.*private/,'Malaysian private national-school entry; outside the current international-school scope.'],
 [/pre school|preschool|early years|nursery|kindies|montessori kids|tiny treasure|san lorenzo|sparkles montessori|toddler|kitakids|lion city|small wonder|smart reader|the children s house/,'Standalone preschool/early-years listing; no primary or secondary international campus identified from this entry.'],
 [/university|sunway college|methodist college|taylor s college/,'Tertiary or standalone pre-university institution; outside school-campus scope.'],
 [/tuition|language centre|french language|morris allen|kumon|eye level|bm world|music school|academy of music|gymboree|kidzania|right brain|tweedlewink|seriously addictive maths/,'Language, tuition, enrichment or activity provider; not an international primary/secondary school campus listing.'],
 [/training centre|therapy|therapeutic|autism behavioral center|association|persatuan|society|foundation|early intervention|bridges eip|spices|oasis place|cads enhancement|dyslexia powerup|hils learning|si world|rc deaf missions|rumah kebajikan/,'Therapy, support, association or training-service listing. No separate international primary/secondary campus established by this directory entry.']
];
const exceptions = [
 [/cempaka.*cheras/,'International versus national provision at Cheras is unresolved; do not copy Damansara subjects or assume a separate international campus.'],
 [/wesley.*sungai buloh|wesley.*coalfields/,'Directories disagree on international versus national status; current official campus site could not be retrieved.'],
 [/zenith.*klang/,'Current Klang school site describes KSSR/KSSM; international Zenith in Seremban is outside scope.'],
 [/adni/,'Reviewed official primary page specifies national curriculum. A distinct international stream/campus was not established.'],
 [/malaya/,'Parent-group page confirms the school, but current campus address, year levels and school-specific contact were not sufficiently established; former school contact URL returned 404.'],
 [/nova international/,'No sufficiently corroborated current official campus and contact source established.'],
 [/enso/,'Official academy describes Cambridge learning and specialist support; eligibility as a distinct international school remains unresolved. TTDI opening is planned for January 2027.'],
 [/atlas|enhance|breakthru|wisdom home|ace edventure biosphere/,'Academy/learning-centre listing: verify current school registration and distinct campus before promoting to the directory.']
];
const addIds = new Set(coverageAdditions.map(s=>s.id));
const unique = new Map();
for(const page of inventory) for(const link of page.links){
 const url=new URL(link.url,page.url).href;
 if(!unique.has(url))unique.set(url,{name:link.name,url,sourcePages:[]});
 unique.get(url).sourcePages.push(page.url);
}
const candidates=[...unique.values()].map(c=>{
 const n=norm(c.name),special=exceptions.find(([re])=>re.test(n)),out=excluded.find(([re])=>re.test(n));
 if(special)return {...c,disposition:'unresolved',reason:special[1]};
 if(out)return {...c,disposition:'excluded',reason:out[1]};
 const rule=mappings.find(r=>r.pattern.test(n));
 if(rule)return {...c,disposition:rule.ids.some(id=>addIds.has(id))?'added_or_expanded':'already_present',campusIds:rule.ids,reason:'Reviewed name/alias match. Group-level entries may map to multiple separately evidenced campuses; this is not a fresh verification of every pre-existing field.'};
 return {...c,disposition:'unresolved',reason:'Directory entry has no verified international primary/secondary campus match. Retained for eligibility/location research; not silently discarded.'};
});
const summary={sourceFamilies:3,sourcePages:inventory.length,listingOccurrences:inventory.reduce((n,p)=>n+p.links.length,0),uniqueSourceListings:candidates.length,addedCampuses:coverageAdditions.length};
for(const status of ['already_present','added_or_expanded','excluded','unresolved'])summary[status]=candidates.filter(c=>c.disposition===status).length;
const audit={reviewed:'2026-10-31',scope:'International and expatriate primary/secondary campuses in Kuala Lumpur, Putrajaya and Selangor. Primary subjects only, matching the application schema. No claim of exhaustive official registration coverage.',summary,
 method:['Captured every paginated result from EDM and MySchools for all three regions, plus the broader Kuala Lumpur International Schools Guide.','Reconciled each unique source profile to existing records, verified additions, explicit exclusions or an unresolved queue.','Verified new field values from official school/group/government sources. Shared programmes and recruitment channels are labelled; general emails are never classified as recruitment without explicit application instructions.','No map coordinates inferred for new campuses. No mailbox deliverability or live vacancy guarantee.'],
 diagnosis:{cause:'Discovery coverage gap, not a demonstrated crawler rejection.',evidence:'Spectrum is present in the captured discovery inventories. The prior directory had no retained candidate-to-campus reconciliation proving full source coverage. Subsequent reviews enriched known records, so undiscovered campuses could remain missing.',limits:'No historical crawler request log establishes which earlier query, page limit or fetch failure caused the original omission. Those specific causes cannot be proved retrospectively.',prevention:'Retain this inventory and one disposition per source profile; rerun collection and reconcile new or changed entries, including multi-campus groups and rebrands.'},
 limitations:['Unresolved candidates remain; this audit does not certify all operating campuses are covered.','Source pages may lag moves, closures and rebrands. National-school or learning-centre status needs separate verification when ambiguous.','Subject lists may be partial or shared across a school group; notes record scope. Empty subjects mean unverified or secondary-only, never inferred from Cambridge/IPC branding.','International Schools Database timed out and SchoolAdvisor regional results were not extractable; neither is counted as a reconciled source.','Existing records are matched for identity only unless explicitly noted; their prior field verification dates remain unchanged.'],
 additionalCampusQuestions:[
 {name:'Beaconhouse Newlands / Reigate / Rafflesia Kajang',reason:'Possible move/rebrand and overlapping Kajang address; avoid duplicate operating campuses. Current Beaconhouse recruitment still mentions Newlands/Reigate, so directory move labels alone are insufficient.',sources:['https://beaconhouse.edu.my/career/','https://www.ris.edu.my/rafflesia-international-school-puchong']},
 {name:'Havil secondary campus',reason:'Official site describes a new secondary campus; a distinct current address was not established in readable page content.',sources:['https://havil.edu.my/']},
 {name:'GIIS secondary campus',reason:'Separate historical address found, but current confirmation remains outstanding; do not duplicate the existing primary campus with an old address.',sources:['https://kualalumpur.globalindianschool.org/']},
 {name:'Reed Seri Kembangan',reason:'Separate campus lead needs official current verification; Rawang record does not establish this campus.',sources:['https://www.reed.edu.my/']},
 {name:'Regent Puchong / Bukit Jalil',reason:'Older directory campuses not corroborated by current official campus navigation; not added.',sources:['https://regent.edu.my/']}
 ],addedCampusIds:coverageAdditions.map(s=>s.id),candidates};
for(const c of candidates)for(const id of c.campusIds||[])if(!schools.some(s=>s.id===id))throw Error(`Missing campus ${id}`);
write('research/coverage-audit-2026-10-31.json',audit);
console.log(JSON.stringify(summary,null,2));
console.log('UNRESOLVED NAMES\n'+[...new Set(candidates.filter(c=>c.disposition==='unresolved').map(c=>c.name))].join('\n'));
