# Movr — Product & Market Handoff

_Last updated: 2026-09-28_

This is the **living source of truth for Movr's product/market thesis**. It is meant to be read by Lorenzo, ChatGPT, Claude/Claude Code and any future collaborator before making product decisions.

`handoff.json` remains useful for the older technical/product snapshot, but this file supersedes it for **current strategy, ICP, discovery and market thinking**.

---

## 0. DECISION update (2026-09-28, later the same day)

Two Claude sessions worked on this pivot in parallel today and each independently wrote a `MOVR_HANDOFF.md`. This file (the one already wired into `CLAUDE.md`) was kept as the canonical version; the other session's research was folded in as linked files rather than duplicated here — see §18 below.

**DECISION, confirmed directly by Lorenzo**: container trucking is not one hypothesis among three anymore. **Movr commits to a single vertical — container trucking / autotrasporto container — full stop.** Do not run the parallel ICP A (general cargo) / ICP C (freight forwarder) tracks described in §8-9 below as originally written. Those sections are kept for institutional memory (they explain real alternatives that were considered), but §8's ICP A and ICP C and the 10/10/10 split in §9 are **superseded**: discovery effort goes entirely into container trucking carriers (ICP B). Update the working claim in §1 accordingly when read: treat "AI Transport Manager for SMEs in road haulage" as the long-term brand umbrella, not today's targeting — today's targeting is container trucking only.

---

## 1. Current thesis

### Working claim

> **Movr is the AI Transport Manager for SMEs in road haulage.**

### Strong product promise

> **Movr receives the order and makes the administrative work disappear until the invoice.**

### Vertical — decided, not a hypothesis under test (see §0)

> **Container trucking / port drayage**, starting from Genoa + Savona/Vado + La Spezia.

Long-term ambition if the wedge works:

> **The operating system for container trucking.**

The wedge itself (which capability ships first, which ICP fleet-size band, which pricing) is still open and must be resolved by discovery — but the vertical choice itself is a decision, not one of several hypotheses being tested in parallel.

---

## 2. Why container trucking is interesting

Container trucking is the road movement of shipping containers between ports/terminals, depots, warehouses and customers.

It is operationally more complex than normal point-to-point road freight because the trucker depends on several external actors:

- ocean carrier / shipping line
- terminal
- customs / port systems
- freight forwarder / customer
- consignee / warehouse
- empty-container depot
- driver + tractor + chassis/semitrailer

The container normally belongs to the shipping line, not to the trucking company. The job therefore does **not** end at delivery: the empty unit usually has to be returned to a nominated depot/terminal within the allowed free time.

### Import lifecycle

1. Freight forwarder/customer sends transport order.
2. Container arrives at port.
3. Carrier release + customs release + terminal availability must all be ready.
4. Pickup slot/access is arranged where required.
5. Dispatcher assigns driver/tractor/chassis.
6. Driver enters terminal and picks up loaded container.
7. Container is delivered to consignee/warehouse.
8. Container is unloaded.
9. Empty-return location is confirmed (can change).
10. Driver returns empty container.
11. POD/EIR/waiting times/accessorials are reconciled.
12. Customer is invoiced.

### Export lifecycle

1. Customer/forwarder has an ocean booking.
2. Empty container is released by shipping line/depot.
3. Trucker collects empty.
4. Empty is positioned at shipper/customer.
5. Container is loaded, sealed and weighed (VGM where relevant).
6. Loaded container is delivered to terminal before cut-off.
7. Gate-in/documentation is confirmed.
8. Transport is closed and invoiced.

### Why this is a good software vertical

The dispatcher is coordinating a **state machine with many external dependencies**, not just choosing a route.

Typical failure points:

- container not actually released
- customs hold
- terminal slot unavailable
- port congestion / waiting time
- driver or vehicle mismatch
- consignee cannot unload
- empty-return depot changes
- free time expires
- waiting/accessorial charges are forgotten in billing
- POD/EIR/docs are lost in email/WhatsApp

This creates a natural place for Movr to become the operational system of record.

---

## 3. Key product insight: this is not generic backhaul

For a generic fleet, optimization is often described as **backhaul / reducing empty miles**.

For container trucking, the more vertical concept is often:

- **street turn / triangulation**: reuse an import container that has become empty for a compatible export move instead of returning it empty and collecting another empty container;
- **dual transaction**: combine an inbound/outbound terminal move when operationally possible;
- optimize empty returns, depot changes and terminal visits.

This may be a stronger container-specific product surface than a generic `AI Backhaul Finder`.

---

## 4. What “OS for container trucking” should mean

Movr should aim to own the full lifecycle **from transport order to cash**, not necessarily every external system.

### Core workflow

**Order intake → readiness → planning → dispatch → execution → delivery → empty return → documents → accessorials → invoice**

Potential product modules:

1. **AI order intake**
   - Read email/PDF/Excel/EDI.
   - Extract container, route, dates, customer, equipment, booking/reference data.
   - Create transport order automatically.

2. **Container readiness control tower**
   - Carrier release.
   - Customs status.
   - Terminal availability.
   - Last free day / deadlines.
   - Empty return instructions.
   - Exceptions requiring human action.

3. **Dispatch + planning**
   - Assign driver/vehicle.
   - Respect operational constraints.
   - Suggest best sequence.
   - Optimize terminal visits, empty moves and triangulations.

4. **Driver workflow**
   - Job instructions.
   - Status updates.
   - Photos/POD/EIR.
   - Waiting time capture.

5. **Exception management**
   - “Work by exception”: dispatcher should not manually inspect every load.
   - Alert only when a shipment needs intervention.

6. **Billing / margin recovery**
   - Detect waiting time, port/congestion fees and other accessorials.
   - Attach the right documents.
   - Prepare invoice quickly after job completion.

7. **Customer visibility**
   - Tracking/status without repeated calls/emails.

### Important constraint

**Do not make terminal slot booking/API access the single dependency of V1.**

Terminal/port systems may:

- have no usable public API;
- expose closed/proprietary interfaces;
- require company credentials;
- vary by terminal;
- change workflows.

Movr can still be valuable if V1 owns orchestration and the system of record while a human books/confirms the slot in the external portal. Integrations/automation can be added terminal by terminal later.

---

## 5. Market facts to keep in mind

### Italian road haulage — broad universe

- Active Italian road-haulage businesses at the end of 2025: **99,321** (Albo Autotrasportatori).
- Latest clean fleet-size breakdown currently collected in this handoff is year-end 2024:
  - **5,453** companies with 21–50 vehicles
  - **1,546** companies with 51–100 vehicles
  - **989** companies with >100 vehicles
- That means **7,988 companies with >20 vehicles** in the 2024 official breakdown.

This ~8k is a useful **broad structured-carrier universe**, not the container-trucking count.

### Rough software TAM for structured Italian carriers

Illustrative only:

- 7,988 carriers × €10k ARR = ~**€80m ARR**
- 7,988 carriers × €20k ARR = ~**€160m ARR**
- 7,988 carriers × €30k ARR = ~**€240m ARR**

This is a broad road-haulage software TAM. Do **not** present it as the TAM of container trucking.

### Ligurian container traffic / demand density

2025:

- Ports of Genoa (Genova + Savona/Vado): **2,999,486 TEU** total.
- Of these, **1,919,700 TEU** were full gateway import/export traffic — the relevant category for inland logistics rather than pure transshipment.
- La Spezia: **1,217,461 TEU** total.
- La Spezia's rail share was about **34.4%** for the main terminal traffic, meaning road remains a very large inland mode.
- An industry analysis reported a container rail ratio of roughly **13.2%** for Ports of Genoa and **27.8%** for La Spezia; exact methodology/denominator should be checked before using in fundraising materials.

Important: **TEU is not equal to physical container count**. A 40-foot container is 2 TEU. Do not translate TEU directly into truck trips without assumptions.

### Current pain signal in Genoa

In 2026, Ligurian road-haulage associations publicly cited:

- around **2,500 container truck trips/day** at the Port of Genoa;
- around **70%** reportedly experiencing roughly 1 hour of waiting at departure and 1 hour at arrival beyond free time;
- an estimated **€130m/year** of inefficiency/diseconomy attributed to waiting;
- associations proposed/continued a port congestion fee in the range of roughly **€150–250 per trip** in July 2026.

Treat association estimates as market evidence to validate, not as audited financial data.

---

## 6. The container-trucking TAM is NOT cleanly published

There is no obvious authoritative Italian dataset that says:

> “There are exactly X container-trucking companies.”

Why:

- official road-haulage registers classify hauliers broadly;
- ATECO/NACE road freight does not reliably distinguish container trucking from general cargo;
- many carriers do both container and conventional work;
- fleet ownership/subcontracting models vary.

Therefore the correct approach is to build a **bottom-up SAM**.

### Bottom-up SAM method

For each relevant port cluster:

1. collect all road hauliers operating in the province/port catchment;
2. identify whether they explicitly do container transport;
3. capture fleet size;
4. capture estimated number of dispatch/operations staff;
5. capture ports served;
6. capture current TMS/software stack;
7. capture whether they own fleet vs subcontract;
8. estimate plausible ACV.

Then calculate:

`eligible companies × expected ACV = local software SAM`

Do this first for:

- Genova
- Savona/Vado
- La Spezia

Then expand to:

- Livorno
- Trieste
- Venezia/Ravenna
- Naples/Salerno
- other Italian gateway ports

Then Europe:

- Barcelona/Valencia
- Rotterdam
- Antwerp-Bruges
- Hamburg/Bremerhaven
- Le Havre
- etc.

---

## 7. Where to find target companies

### Source 1 — Albo Autotrasportatori

Public search allows filtering registered road-haulage businesses by **province and municipality**.

Start with:

- Genova
- Savona
- La Spezia

Then enrich every company through website/LinkedIn/registry data and tag `container_transport = yes/no/unknown`.

### Source 2 — Trasportounito / TU Service

TU Service says it has **500+ members and ~3,000 vehicles**, with around **60% of those vehicles based in the province of Genova**.

This is potentially one of the best warm-access channels in the Genoa cluster. Historical industry material also notes many of its members are involved in container transport.

### Source 3 — Spediporto / local logistics network

Spediporto represents freight forwarders, couriers and transport operators in Genoa and can provide access to both the customer side (forwarders) and carrier side.

### Source 4 — sector associations

Useful Ligurian/Italian associations include:

- Trasportounito
- ALIAI
- ANITA
- CNA Fita
- Confartigianato Trasporti
- FAI
- FIAP
- Assotir / Assotrasporti

The 2026 port-fee debate itself provides a map of the associations representing companies operating container services to/from Genoa.

### Source 5 — targeted web/LinkedIn research

Search combinations such as:

- `trasporto container Genova`
- `autotrasporto container Genova`
- `trasporto container La Spezia`
- `container Vado Ligure trasporti`
- LinkedIn company + operations manager / transport manager / dispatcher

Examples already surfaced in research: Gandini Trasporti, Parrinello, CMI, Spinelli. These are examples, not necessarily the ideal ICP.

### CRM fields to build immediately

- company
- city
- ports served
- container trucking? yes/no
- fleet size
- employees
- estimated revenue
- owner/CEO
- head of operations / transport manager
- dispatchers count
- current TMS
- WhatsApp/Excel/manual signals
- owned vs subcontracted fleet
- daily container moves
- inbound source / warm intro
- discovery status
- design partner fit
- willingness to share historical jobs
- willingness to pilot
- willingness to pay

---

## 8. ICP hypotheses to test

### ICP A — General cargo carrier

**20–100 vehicles**

Test:

> AI Transport Manager / Fleet OS

### ICP B — Container trucking carrier

**Container haulier serving Genova / Savona-Vado / La Spezia**, ideally structured enough to have internal dispatch/operations.

Initial fleet hypothesis: **20–100 vehicles**, but do not over-constrain before discovery; PortPro explicitly targets even 5–20-truck drayage carriers in the US, so smaller fleets may still have strong willingness to pay if container complexity is high.

Test:

> Container Transport OS / AI Transport Manager for container trucking

### ICP C — Freight forwarder

Forwarder managing many container shipments and third-party carriers.

Test:

> AI Operations layer: document/order ingestion + shipment orchestration + carrier coordination

---

## 9. Discovery plan

Run **30 initial interviews**, split approximately:

- 10 general cargo carriers, 20–100 vehicles
- 10 container trucking carriers around Genova / La Spezia / Savona-Vado
- 10 freight forwarders

Do **not** show the same demo to all three groups. Show only the workflow relevant to that audience.

Goal: identify the segment with the highest combination of:

- pain intensity
- frequency
- measurable ROI
- willingness to change workflow
- access to data/integrations
- willingness to pilot/pay
- large enough European expansion market

---

## 10. Discovery questionnaire — must be preserved

The key rule:

> **Do not ask “Are you digitalized?” Ask them to share the screen and show exactly how an order moves through the company.**

### Current workflow

| Area | Question |
|---|---|
| Order intake | Email / PDF / EDI / API / WhatsApp? |
| Order entry | Does someone manually retype/copy data? |
| Dispatch | Excel, whiteboard, TMS, algorithm? |
| Driver communication | Phone, WhatsApp, driver app? |
| Tracking | Automatic or does someone call/check portals? |
| Route planning | Manual or optimized? |
| Backhaul / empty moves | Manual, TIMOCOM/Trans.eu, automatic? |
| POD | Paper, WhatsApp, email, app? |
| Billing | Are data re-entered manually? |
| Pricing | Excel, memory, TMS, rate cards? |
| Trip margin | Known before, after, or never? |
| Exceptions | Does software alert or does a human discover them? |
| Software | How many tools does an operator use every day? |

### Add container-specific questions

- Who sends the transport order?
- Which data are missing most often?
- How do you know a container is actually ready for pickup?
- How do you check customs/release status?
- How do you book/check terminal slots today?
- How many terminal portals does one dispatcher use?
- How often does the empty-return depot change?
- Who checks the empty-return deadline?
- How do you manage demurrage/detention/free time?
- What happens when a truck waits 2 hours at the terminal?
- Is waiting time always invoiced to the customer?
- How much accessorial revenue is lost?
- How do you pair import/export moves today?
- Do you perform street turns / container triangulations? How are they found/approved?
- How many container moves can one dispatcher coordinate per day?
- How many calls/messages per load?
- How long from completed delivery/empty return to invoice?

### Quantitative questions

For every company capture:

- trucks/tractors
- trailers/chassis
- drivers
- dispatchers/operations staff
- orders per day
- container moves per day
- minutes of administrative work per job
- empty km / empty moves
- waiting hours per week/month
- unbilled waiting/accessorials
- dispatcher productivity (loads per dispatcher/day)
- time-to-invoice
- gross margin per job if they will share it

---

## 11. What evidence matters more than “they like it”

Rank signals roughly like this:

1. “Interesting demo.” — weak
2. Gives detailed feedback — better
3. Introduces us to dispatchers/owner — good
4. Lets us observe operations live — strong
5. Shares historical orders/jobs/data — very strong
6. Commits to a 4-week pilot — very strong
7. Pays / signs LOI with price — strongest

Critical design-partner asks:

- Can we shadow operations for half/full day?
- Can you give us your last 100–500 transport orders (sanitized if needed)?
- Can we run Movr in parallel with your current workflow?
- If it achieves agreed KPI, will you pay €X/year?

---

## 12. ROI hypotheses to validate

Do not sell “AI”. Sell measurable economics.

Potential ROI drivers:

- more loads/container moves per dispatcher
- lower manual admin time per order
- fewer empty movements
- fewer unnecessary terminal trips
- faster reaction to release/terminal changes
- lower demurrage/detention exposure
- better capture of waiting/accessorial charges
- faster POD/document reconciliation
- shorter time from completed job to invoice
- fewer status calls/emails from customers

Candidate north-star metric:

> **Container moves handled per dispatcher per day**

Other strong metrics:

> **minutes of human work per transport order**

> **€ of accessorial/waiting revenue recovered**

> **time from job completion to invoice**

---

## 13. Product/GT​​M decisions currently leaning this way

- Founder-led sales during PMF discovery.
- Do not hire a normal SaaS AE as the first fix for PMF.
- A strong logistics operator / dispatcher / domain expert may be more valuable early than a pure salesperson.
- Build around 3–4 highly similar design partners after broad discovery, not four random logistics companies.
- Prefer a narrow vertical wedge over a generic Italian TMS.
- Avoid building customs as a major first vertical unless discovery strongly disproves the carrier hypothesis.
- Avoid depending on terminal APIs/slot automation for V1.
- Keep Italy as the **beachhead**, not the final TAM story.

---

## 14. Reference companies / products to study

### PortPro

Most important reference for the container-trucking thesis.

Positioning: drayage TMS/operating platform. Workflow from delivery order to payment; order entry, dispatch, customer service, invoicing and AI agents.

What to copy conceptually:

- verticality
- order-to-cash ownership
- dispatch UX
- empty-return/appointment awareness
- accessorial capture
- AI as workflow execution rather than chatbot

### Qargo

Reference for modern European TMS and order-to-cash workflow. Strong proof that European transport software is VC-backable, but also a reason not to launch as a generic TMS.

### TruckerZoom

Useful current drayage benchmark. Public self-serve pricing roughly **$30–$120 per active driver/month** depending on plan. Shows that smaller drayage fleets can pay meaningful recurring software fees.

---

## 15. Sources currently used for market thinking

Keep these refreshed before using numbers in an investor deck:

- Albo Autotrasporto / Rivista TIR — Italian haulage business counts and fleet bands
  - https://www.alboautotrasporto.it/
  - https://rivistatir.it/
- Ports of Genoa / port traffic reporting
  - https://www.assoporti.it/
- Autorità di Sistema Portuale Mar Ligure Orientale — La Spezia traffic
  - https://www.adspmarligureorientale.it/
- Trasportounito / TU Service
  - https://www.trasportounito.net/
  - https://www.tuservice.it/
- Spediporto
  - https://www.spediporto-genova.com/
- PortPro
  - https://portpro.io/
- Qargo
  - https://www.qargo.com/
- TruckerZoom
  - https://www.truckerzoom.com/

---

## 16. Immediate next actions

1. Build a **100-company target database** for container trucking around Genoa/Savona/La Spezia.
2. Get warm intros through Trasportounito/TU Service, Spediporto and existing logistics contacts.
3. Complete 10 container-carrier discovery calls before materially expanding product scope.
4. Shadow at least 2 dispatch desks live.
5. Collect 100–500 real transport orders from at least one potential design partner.
6. Measure current `minutes/order`, `moves/dispatcher/day`, waiting, accessorial capture and time-to-invoice.
7. Decide whether the first wedge is:
   - order-to-cash automation;
   - container control tower;
   - dispatch/triangulation optimization;
   - or a combination narrow enough to ship in one MVP.
8. Only after this, choose 3–4 design partners and define the production MVP.

---

## 17. Open questions

These must be answered by discovery, not assumed:

- What exact fleet size has the strongest willingness to pay?
- Is the buyer the owner/CEO, operations manager or transport manager?
- Do carriers want to replace their TMS or add Movr on top?
- Which legacy TMS products dominate the Italian container-haulage niche?
- Which inputs can Movr receive by email/EDI/API vs manual status?
- Which Genoa/Savona/La Spezia terminal systems expose usable integrations?
- Is accessorial recovery a stronger pain than dispatch optimization?
- How common are street turns/triangulations in Italy and who approves them?
- What is the real number of container-haulage companies in the first three port clusters?
- What ACV can be closed without enterprise procurement?
- How much of the product generalizes cleanly from container trucking to conventional FTL?

---

## 18. Linked research/product/GTM files (added by the parallel Claude Code session, 2026-09-28)

Rather than duplicate content here, the parallel session's output lives in dedicated files, cross-referenced from this handoff per the maintenance rule below. Read these instead of re-deriving them:

- `research/container-trucking-workflow.md` — same import/export lifecycle as §2 here, plus an explicit pain matrix (manual / phone-email-WhatsApp / multi-portal / error-prone / costs money / slows billing) per process step.
- `research/container-trucking-terminal-integrations.md` — **answers the open question above** ("which terminal systems expose usable integrations"): only **Vado Gateway (APM Terminals) has a confirmed public, free API** (TERMPoint, `developer.apmterminals.com`). Genova (PSA Prà/SECH) and La Spezia (LSCT/Terminal del Golfo) have no publicly documented API — direct contact required. Also documents the national PLN/PCS interoperability push (PNRR, ~€250M, Genova already connected) as a 1-2 year horizon, not something to build against today.
- `research/container-trucking-competitors.md` — deeper competitor pass than §14 here: adds Rose Rocket and Raft, with sourced G2/Capterra findings. Important correction to keep in mind: **Qargo is not drayage-specific** (Belgian generalist TMS, UK/BE/NL/IE/FR market, €28M Series B Dec 2025) and **Raft is not a trucking competitor** (AI platform for freight forwarders/customs brokers, not drayage). **PortPro has already expanded to Rotterdam** — treat it as a live European entrant, not just a US reference.
- `product/container-trucking-v1.md` and `product/container-trucking-roadmap.md` — capability-by-capability spec (mirrors §4 here) explicitly tied to which existing Movr code is reusable: the Exception Center (`lib/exceptions/motore.ts`) and the "Documenti trasporto" document-to-cash flow (`app/flotta/documenti/`) are the two most reusable pieces for this pivot; the current Porti module (built for freight forwarders/customs brokers, not truckers) is flagged as misaligned with the new persona — decision on what to do with it is deliberately deferred to after discovery, not made now.
- `gtm/container-trucking-prospects.csv` — first tranche of the 100-company database (34 companies researched so far: the 11 seeds from the brief + 23 more, each field sourced or marked UNKNOWN, classified A/B/C). Two names from this file's own §7 examples (Parrinello, CMI) are already covered here; the others (Gandini Trasporti) still need adding to the next tranche.
- `gtm/top-20-design-partners.md` — shortlist built from the current A/B tier of the prospects file (16 companies; 100-company database still in progress, so this is not yet a clean top-20 and says so explicitly).
- `gtm/discovery-playbook.md` — ready-to-send LinkedIn/email/WhatsApp opening scripts and a 30-minute call script, adapted from the spedizionieri-segment interview guide already in `kb/04-clienti-e-outreach/guida-interview-design-partner.md`.

**Data discrepancy to resolve before using either number externally** (e.g. in a deck): this file's §5 states "Active Italian road-haulage businesses at the end of 2025: 99,321 (Albo Autotrasportatori)". The parallel session's `research/container-trucking-market.md` independently found, for the same Albo Nazionale Autotrasportatori at the same point in time, **76,083** ("in calo da ~99.321 nel periodo recente, -20.000 circa dal 2015" — suggesting 99,321 may be an older figure, not end-of-2025). Neither session could reach alboautotrasporto.it directly (network proxy blocked WebFetch to it in both sessions) — both numbers are secondary citations. **Verify directly on alboautotrasporto.it before either number goes in an external document.**

---

## Maintenance rule

Whenever a material market/product conclusion changes, update this file rather than creating a new disconnected strategy note. Keep **facts**, **hypotheses**, and **decisions** clearly separated.
