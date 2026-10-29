# Schools Here

A local personal job-search directory for international primary and secondary schools across Kuala Lumpur, Putrajaya and all of Selangor. Primary provision is shown by default for the user's ages 7–11 focus.

## Run

Install Node.js 20 or newer, then run `npm start` in this folder. Open http://127.0.0.1:4173. No package installation, API key, build or account is required. Stop the server with Ctrl+C. To use a different port, set the `PORT` environment variable before starting.

## Features

- Search school names, neighbourhoods, addresses and curriculum labels.
- Filter region, neighbourhood, explicitly sourced primary subjects, and contact type.
- Interactive OpenStreetMap map with clickable school pins, pan, zoom and fit results. Keyboard navigation is supported. A schematic fallback remains usable when tiles are unavailable.
- Sort by name, recruitment contact, or straight-line distance from a chosen location, browser geolocation or entered coordinates.
- Save schools in browser local storage; export/restore JSON backups.
- Export the current filtered directory as CSV with source links, distance estimates and saved status.
- School details show contact provenance, application instructions, primary subjects and location uncertainty.

## Research and limitations

Snapshot: **28 October 2026**. This is a broad working directory, **not a certified exhaustive register**. Official school websites were checked alongside regional discovery directories. Campus records are distinct; shared recruitment addresses may repeat across campuses. A number of directory leads still require official confirmation and have no map coordinates. Older directory locations may differ from current school pages; conflicts are noted in records.

Follow-up review: **115 campus records**, including **107 with primary provision**, **114 with sourced campus addresses**, **106 public email contacts** (**42 HR/recruitment**) and **90 sourced primary subject lists**, many partial. This adds 66 subject lists, 20 email contacts and 14 established campus addresses to the original snapshot, including a separate Maverick primary campus. [Research status](research-status.json) itemizes the remaining 17 primary subject gaps, nine email gaps and one unresolved operating/location lead (Emerald Gardens). Inspiros Klang's official page still describes construction completion; confirm its opening and teaching location before visiting.

Emails are public addresses supported by the cited source; mailbox deliverability has not been tested. General/admissions contacts are explicitly labelled fallbacks. No emails were inferred from naming patterns. Some cited school PDFs are older; their age is noted. This app does not establish live vacancy availability.

Only individually evidenced primary subjects are populated. Empty or partial subject lists do not imply a school does not teach other subjects. Subject filtering can therefore exclude potential matches. Map coordinates are manually approximate unless `coordinateSource` is populated; distances are estimates, not route distances or commute times. The online basemap requires internet access. Offline fallback roads are schematic, not road geometry.

Saved schools remain in the browser profile and origin. Switching between `localhost` and `127.0.0.1` uses separate storage. Use the JSON backup for transfer. Geolocation coordinates stay in memory. Map tile requests and optional Google Fonts use third-party servers. There is no application backend, analytics, automatic data refresh or email sending.

## Maintain

`data.js` contains the research records and field-level source URLs. `discovery: true` denotes leads awaiting official confirmation; keep coordinates and email null until evidence is available. `checked` is the research review date, not a guarantee of currency. `primary` controls the default age focus. Subject labels are normalized (ICT → Computing, Malay → Bahasa Melayu) for filtering.

`applicationUrl` links a confirmed careers portal or CV form separately from the email fallback. `subjectResearchSource` and `subjectResearchNote` explain unsuccessful primary subject verification without populating the subject filter. School details and CSV exports include those research notes. `research-status.json` records the outcome of this review and should be refreshed after future research edits.

Main source directories: [Selangor](https://educationdestinationmalaysia.com/schools/selangor), [Kuala Lumpur](https://educationdestinationmalaysia.com/schools/kuala-lumpur), and [Putrajaya](https://educationdestinationmalaysia.com/schools/putrajaya). These are discovery aids, not complete official registers. Each populated school record has its own evidence links.

Run `npm test` for data integrity, filter intersections, distance ordering, projection and CSV checks. Run `npm run check` for JavaScript syntax validation.
