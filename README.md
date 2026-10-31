# Schools Here

Latest follow-up — **31 October 2026**: reviewed all nine missing primary-subject lists and all 26 newly added campuses without a recruitment/HR email. Added **seven sourced subject lists** (some partial/shared), **eight published recruitment email destinations**, and **four additional application routes**. Totals: **158 campuses**, **129 primary subject lists**, **146 public emails**, and **74 HR/recruitment emails**. Qosmo and Sekolah Indonesia Kuala Lumpur remain unresolved for primary subjects; seven reviewed campuses still have no established recruitment route. The Japanese-school recruitment address is for a specific administrative role, not teaching. [Detailed follow-up outcomes and sources](research/review-2026-10-31-primary-recruitment.json).

Previous coverage audit — **31 October 2026**: reconciled **472 source listings across 20 pages from three directories**, then added **41 campuses** using official school/group/government evidence. The directory now contains **158 campuses**, **139 with primary provision**, **145 public emails**, **66 HR/recruitment emails**, and **122 sourced primary subject lists** (including partial lists). Of the additions, **21 have named primary subjects**, **15 have recruitment/HR emails**, and **22 have a verified recruitment mailbox or application channel**. Nine added primary campuses still need subject lists; general contacts remain explicitly labelled fallbacks. [Audit ledger and unresolved candidates](research/coverage-audit-2026-10-31.json).

A local personal job-search directory for international primary and secondary schools across Kuala Lumpur, Putrajaya and all of Selangor. The default search includes all teaching levels with English and English Literature selected; verified subject data currently covers primary provision.

## Run

Install Node.js 20 or newer, then run `npm start` in this folder. Open http://127.0.0.1:4173. No package installation, API key, build or account is required. Stop the server with Ctrl+C. To use a different port, set the `PORT` environment variable before starting.

## Features

- Search school names, neighbourhoods, addresses and curriculum labels.
- Filter neighbourhood, multiple explicitly sourced primary subjects (matching any selection), and contact type.
- Interactive OpenStreetMap map with clickable school pins, pan, zoom and fit results. Keyboard navigation is supported. A schematic fallback remains usable when tiles are unavailable.
- Sort by name, recruitment contact, or straight-line distance from a chosen location, browser geolocation or entered coordinates.
- Save schools in browser local storage; export/restore JSON backups.
- Export the current filtered directory as CSV with source links, distance estimates and saved status.
- School details show contact provenance, application instructions, primary subjects and location uncertainty.

## Research and limitations

Snapshot: **28 October 2026**. This is a broad working directory, **not a certified exhaustive register**. Official school websites were checked alongside regional discovery directories. Campus records are distinct; shared recruitment addresses may repeat across campuses. A number of directory leads still require official confirmation and have no map coordinates. Older directory locations may differ from current school pages; conflicts are noted in records.

Previous review (28 October 2026): **115 campus records**, including **107 with primary provision**, **114 with sourced campus addresses**, **106 public email contacts** (**42 HR/recruitment**) and **90 sourced primary subject lists**, many partial. This adds 66 subject lists, 20 email contacts and 14 established campus addresses to the original snapshot, including a separate Maverick primary campus. [Research status](research-status.json) itemizes the remaining gaps. Inspiros Klang's official page still describes construction completion; confirm its opening and teaching location before visiting.

Emails are public addresses supported by the cited source; mailbox deliverability has not been tested. General/admissions contacts are explicitly labelled fallbacks. No emails were inferred from naming patterns. Some cited school PDFs are older; their age is noted. This app does not establish live vacancy availability.

Only individually evidenced primary subjects are populated. Empty or partial subject lists do not imply a school does not teach other subjects. Subject filtering can therefore exclude potential matches. Map coordinates are manually approximate unless `coordinateSource` is populated; distances are estimates, not route distances or commute times. The online basemap requires internet access. Offline fallback roads are schematic, not road geometry.

Saved schools remain in the browser profile and origin. Switching between `localhost` and `127.0.0.1` uses separate storage. Use the JSON backup for transfer. Geolocation coordinates stay in memory. Map tile requests and optional Google Fonts use third-party servers. There is no application backend, analytics, automatic data refresh or email sending.

## Maintain

`data.js` and its imported `coverage-additions.js` contain the research records and field-level source URLs. `discovery: true` denotes leads awaiting official confirmation; keep coordinates and email null until evidence is available. `checked` is the research review date, not a guarantee of currency. `primary` controls the default age focus. Subject labels are normalized (ICT → Computing, Malay → Bahasa Melayu) for filtering.

`applicationUrl` links a confirmed careers portal or CV form separately from the email fallback. `subjectResearchSource` and `subjectResearchNote` explain unsuccessful primary subject verification without populating the subject filter. School details and CSV exports include those research notes. `research-status.json` records the outcome of this review and should be refreshed after future research edits.

Main source directories: [Selangor](https://educationdestinationmalaysia.com/schools/selangor), [Kuala Lumpur](https://educationdestinationmalaysia.com/schools/kuala-lumpur), and [Putrajaya](https://educationdestinationmalaysia.com/schools/putrajaya). These are discovery aids, not complete official registers. Each populated school record has its own evidence links.

Run `npm test` for data integrity, filter intersections, distance ordering, projection and CSV checks. Run `npm run check` for JavaScript syntax validation.

### Follow-up research — 29 October 2026

Added seven previously missing primary subject lists (Abedeen, Axcel, Acmar, Canary, Chinese Taipei, Sasana and IGBIS), expanded BSKL’s list, and established six additional published recruitment/HR contacts. The directory now has **97 sourced primary subject lists**, **107 public emails**, and **48 HR/recruitment contacts** across 115 campus records. Several lists remain partial. Nine locations were rechecked, with fuller address details for IGBIS, Axcel and Canary. No approximate map pin has been upgraded to an exact coordinate.

[Review evidence and limitations](research/review-2026-10-29.json) records the contact review and field sources. Ten primary subject lists and eight public emails remain unresolved. Remaining fallback contacts are listed separately from HR/recruitment contacts. BSKL’s HR evidence is a 2025–26 handbook; Primrose’s careers page still refers to September 2025. Sri KDU Subang Jaya explicitly requires vacancy-site applications rather than emailed CVs. Sasana’s official site now schedules its campus move for 2027.

Field-specific `subjectChecked`, `contactChecked` and `locationChecked` dates identify what was rechecked; older record dates are retained. Chinese Taipei’s supporting timetable PDFs are linked in its research trail.

### Second pass on remaining schools — 29 October 2026

Revisited all ten unresolved subject records. Fairview Kuala Lumpur and Subang Jaya now have **partial Music-only entries**, supported by the official Chinese-language PYP page. Eight campuses still have no established primary subject list; the Fairview lists also need completion. Coverage is now **99 sourced subject lists**, including partial lists, and **51 HR/recruitment contacts**. Three additional campuses have recruitment contacts: Dwi Emas, MITstem and Sri KDU Kota Damansara. Sri Emas’s existing recruitment contact was also refreshed to the group talent mailbox. The Sri KDU source is an employee recruitment post about one year old, so current application instructions take precedence.

[Second-pass evidence](research/review-2026-10-29-second-pass.json) records an outcome for each school, group-contact scope, and historical emails deliberately kept out of the verified contact field.


### Multi-source coverage audit — 31 October 2026

The audit captured all reported paginated listings from Education Destination Malaysia (Selangor, Kuala Lumpur and Putrajaya), MySchools (the same three regions), and the broader Kuala Lumpur list from International Schools Guide. Source listings are counted separately across directories: 472 is **not** a count of distinct schools. Every captured profile has a disposition in the [audit ledger](research/coverage-audit-2026-10-31.json): 256 already represented, 67 represented by additions or campus expansions, 97 excluded, and 52 unresolved. Many unresolved entries are academies or support/enrichment providers whose eligibility is unclear. Additional possible campus splits and rebrands are tracked separately. This is a completed reconciliation of those sources, not a certified complete register.

New records include Eaton (two campuses), Lexel (two), Pine Hills (three international campuses), IMAS (three), Rafflesia Puchong, Baseerah, Eagles, Templer Park, STARS, Suria, Tanarata, Stellaire, Stella Maris, Treetop, Vikas, Orbix Klang, Japanese/Korean/Indonesian expatriate schools and others. Separate secondary records were added for Alice Smith, Aspiration and St. John's. Spectrum's two campuses were already present from the preceding correction and are not counted again.

Primary subjects are populated only where individually named by a school source; shared or partial lists are qualified in notes. Secondary-only records intentionally have no primary subject list. No new map coordinates were guessed. Careers pages do not imply an open vacancy, and general/admissions mailboxes do not imply permission to send CVs. Published contact addresses have not been deliverability-tested.

The original Spectrum omission is best supported as a **discovery/reconciliation gap**. Spectrum appears in the captured directories, but the earlier process did not retain an exhaustive candidate ledger, and subsequent reviews enriched existing records. No historical crawl log proves a specific query, pagination or blocking failure. The retained [source inventory](research/coverage-source-inventory-2026-10-31.json), [fetch log](research/coverage-verification-log-2026-10-31.json), field-level sources and unresolved queue make future omissions reviewable.

Maintenance: `node research/reconcile-coverage.mjs` rebuilds this dated ledger from the captured inventory and reviewed matching rules. `research/collect-coverage.ps1` captures the three discovery sources and refuses to save if reported directory totals disagree with retrieved profiles; inspect and update pagination bounds for future audits. Do not overwrite the dated snapshot for a new review date. `research/fetch-audit-pages.ps1` fetches public official pages from a supplied JSON URL list. Extracted emails must be reviewed in context before use. Full temporary page captures are ignored under `tmp/`; durable evidence consists of source URLs, field values, notes, inventory and fetch outcomes.
