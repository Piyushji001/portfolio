# Portfolio Build Kit — Piyush Sharma

Everything you need to build this once, properly, and never touch it again.

**How to use this:** work top-to-bottom. Read section 1–3 so you know what you're building and can push back when Lovable drifts. Then paste the prompts in section 5 one at a time, in order. Don't paste them all at once — Lovable degrades badly on mega-prompts and you'll burn credits fixing hallucinated content.

---

## 1. The concept

### The problem with the obvious version

Every DevOps portfolio looks the same: dark background, purple-blue gradient blob, "Hi, I'm X 👋", a grid of tech logos, three project cards, "Let's work together". Recruiters see forty of these a week. The reference sites you sent (Aceternity especially) are *component libraries* — if you use them straight, you get a site that looks like everyone else who used them straight.

The thing that makes a portfolio memorable isn't the animation library. It's whether the site **behaves like the thing you do.**

### The concept: **Control Plane**

The portfolio presents itself as an infrastructure console — a status page for a system called `piyush.sh`. Not a marketing landing page with terminal decoration, but a site whose structure, language, and states are borrowed from the tools you actually work in: status pages, Grafana, incident postmortems, CI pipelines.

This isn't a gimmick layer on top. It changes the *information architecture*:

| Normal portfolio | Control Plane |
|---|---|
| "About me" | `SYSTEM OVERVIEW` — a spec sheet |
| "Skills" grid of logos | `STACK` — a service topology, grouped by layer |
| "Experience" bullet list | `DEPLOYMENT LOG` — reverse-chronological, versioned |
| "Achievements" | `INCIDENT REPORT` — a real SEV-1 postmortem |
| "Projects" | `ARCHITECTURE` — hoverable system diagrams |
| "Contact" | `ENDPOINTS` |

### The signature moment

**Your AWS account compromise is the single best asset in your resume and almost nobody has one.** 300+ unauthorized EC2 instances across multiple regions, leaked IAM keys revoked, $1,000 in fraudulent billing disputed, production restored in 4 hours. That's a war story with numbers attached.

So the site has one bold moment built entirely around it:

As you scroll into the incident section, **the entire page changes state.** The slate-ink theme floods to a dark red alert palette over ~600ms. A severity badge reads `SEV-1`. A live-drawing area chart spikes — instance count climbing from 12 to 300+ — while a timeline scrubs through the response: `DETECTED → CONTAINED → KEYS REVOKED → INSTANCES TERMINATED → RESTORED`. As the timeline resolves, the chart drops back to baseline, the badge flips to `RESOLVED`, and the page returns to normal with a green status pill: `● All systems operational`.

That's the thing a recruiter screenshots and sends to a colleague. Everything else on the site stays quiet and disciplined so this lands.

### Two secondary delights (small, cheap, high-payoff)

1. **`⌘K` command palette** — the whole site is navigable by keyboard. Type `resume` → downloads the PDF. Type `hire` → opens mail. Type `deploy` → scrolls to projects. Engineers who see a working command palette immediately assume you're competent, because you are.
2. **Terminal easter egg** — press `~` anywhere to drop a real terminal. `whoami`, `ls`, `cat incident.log`, `kubectl get skills`, `uptime`, `sudo hire-me`. Fake but functional. Keep it to ~8 commands, don't over-build it.

---

## 2. Design system

Give this to Lovable verbatim (it's baked into Prompt 0). Written out here so *you* can tell when Lovable has drifted off it.

### Colour — "Slate & Signal"

Deliberately **not** near-black-plus-acid-green (the default every AI builder reaches for) and **not** the Aceternity blue-to-violet gradient. The base is a cool blue-slate ink; the accent is signal amber — the colour of a pager light, a caution beacon, a `WARN` log line. Status hues appear *only* where they're semantically true.

```
Default theme — "operational"
--bg            #0E1116   page canvas (blue-slate ink, not black)
--surface       #151A21   panels, cards
--surface-hi    #1B2129   raised / hover
--hairline      #262E38   1px borders, grid lines
--text          #E7E4DD   primary (warm bone — deliberate warm/cool tension)
--text-dim      #8A94A0   secondary, labels
--accent        #F2A93B   signal amber — links, CTAs, focus, active state
--ok            #46B98A   healthy status only (muted teal-green, NOT #00FF00 acid)
--warn          #F2A93B
--crit          #E0555A
--grid          rgba(255,255,255,0.035)

Incident theme — scoped to the incident section only
--bg            #12080A
--surface       #1A0C0F
--hairline      #3A1A1E
--accent        #E0555A
--grid          rgba(224,85,90,0.06)
```

Transition between themes: `600ms cubic-bezier(0.16, 1, 0.3, 1)` on the CSS custom properties, driven by a class on `<html>`.

### Typography

**IBM Plex Mono** as the *display* face — not as decoration, as the actual headline typeface at 96–140px. Plex was drawn for a technology company; the mono's flared terminals give it real character, and setting headlines in mono is on-brief in a way Inter or Space Grotesk never is. **IBM Plex Sans** carries body copy only. Both free on Google Fonts.

```
Display    IBM Plex Mono 500/600 · clamp(3.5rem, 9vw, 8.75rem) · tracking -0.03em · line-height 0.92
Section    IBM Plex Mono 500 · clamp(2rem, 4vw, 3.25rem) · tracking -0.02em
Eyebrow    IBM Plex Mono 500 · 11px · UPPERCASE · tracking 0.18em · --text-dim
Body       IBM Plex Sans 400 · 16–17px · line-height 1.65 · max-width 62ch
Data       IBM Plex Mono 400 · font-variant-numeric: tabular-nums
```

Metric numbers (60%, 300+, 4h, 10+) get the display treatment — huge mono numerals with an 11px uppercase label underneath. Tabular numerals are non-negotiable; counters that jitter while animating look broken.

### Layout

- Max width `1240px`, 12-column, `24px` gutters.
- **Persistent left rail (220px, desktop only):** section index, a pulsing `● OPERATIONAL` status dot, live IST clock, and an uptime counter counting since your career start. Collapses to a top bar under 1024px.
- **Hairline grid overlay** across the whole page at 3.5% opacity — reads as schematic paper, gives the layout visible structure.
- **Left-aligned and asymmetric throughout.** No centered hero, no centered section headers. Centered layouts are what makes a site read as a template.
- Corner radius: `4px` maximum. This is instrumentation, not a consumer app. No `rounded-2xl` cards.

### Motion

- **Page load:** one orchestrated sequence, not scattered fades. Grid draws in → rail slides from left → hero types → status pill snaps in. Total ~1.4s, then completely still.
- **Scroll:** `IntersectionObserver`, `translateY(16px)` + opacity, 500ms, fires once. Never re-animates on scroll-up.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` everywhere. One curve, used consistently.
- **`prefers-reduced-motion`:** kills every transform and the theme flip; the incident section renders in its resolved state immediately. This must actually work — it's the kind of detail a senior reviewer checks.

### Explicitly banned

Tell Lovable these are forbidden, because it will reach for all of them:

> purple-to-blue gradient backgrounds · glassmorphism / `backdrop-blur` cards · floating particle fields · emoji anywhere · "Hi, I'm..." / "Let's work together" / "Get in touch" copy · the `I am a [Developer|DevOps Engineer|Cloud Enthusiast]` rotating typewriter · stock photos or illustrations · tilted 3D cards used decoratively · logo-soup skill grids · centered hero text · `rounded-2xl` · neon glow on text · animated gradient borders on every card · progress bars for skill levels ("React 85%")

---

## 3. Page structure

```
┌──────────┬─────────────────────────────────────────────────┐
│          │  00 · HERO                                      │
│  LEFT    │  boot sequence → PIYUSH SHARMA (mono, huge)     │
│  RAIL    │  ● operational · uptime 1y 7mo · Jaipur, IST    │
│          │  [ view work ]  [ resume.pdf ]                  │
│  ● OPS   ├─────────────────────────────────────────────────┤
│  ───     │  01 · SYSTEM OVERVIEW                           │
│  00 hero │  short bio (3 sentences) + 4 metric tiles       │
│  01 sys  │  60% · 300+ · 10+ · 3 clouds                    │
│  02 stak ├─────────────────────────────────────────────────┤
│  03 log  │  02 · STACK                                     │
│  04 sev1 │  topology grouped by layer, not a logo grid     │
│  05 arch ├─────────────────────────────────────────────────┤
│  06 end  │  03 · DEPLOYMENT LOG (experience)               │
│          │  animated CI pipeline node graph as the header  │
│  IST     ├─────────────────────────────────────────────────┤
│  14:32   │  04 · INCIDENT REPORT   ◀── SIGNATURE           │
│          │  theme flips to alert red · chart · timeline    │
│          ├─────────────────────────────────────────────────┤
│          │  05 · ARCHITECTURE (projects)                   │
│          │  Vistofy + Multi-repo CI/CD as system diagrams  │
│          ├─────────────────────────────────────────────────┤
│          │  06 · ENDPOINTS (contact) + education footer    │
└──────────┴─────────────────────────────────────────────────┘
```

Single page, scroll-driven. No routing, no separate pages — a recruiter spends 90 seconds; don't make them click.

---

## 4. Content data — paste this FIRST

**This is the most important step.** Lovable will invent fake job titles, fake metrics, and fake company names if you don't pin the content down. Give it this file before any UI work.

Prompt to send with it:

> Create a file `src/data/content.ts` with exactly the content below. Do not modify, embellish, or add to any of it. Every string in the UI must come from this file — never hardcode content into components.

```ts
export const profile = {
  name: "Piyush Sharma",
  role: "DevOps Engineer",
  experience: "1.7+ years",
  location: "Jaipur, Rajasthan, India",
  timezone: "Asia/Kolkata",
  careerStart: "2025-01-01",
  email: "mr.piyush0270@gmail.com",
  linkedin: "",   // <-- paste your LinkedIn URL
  github: "",     // <-- paste your GitHub URL
  resumeUrl: "/Piyush_Sharma_Resume_DevOps.pdf",
  bio: "I build and run the infrastructure other people's products sit on. Multi-cloud across AWS, Azure and GCP, containerised with Docker and Kubernetes, shipped through CI/CD pipelines I design and own. I lead a small development team, run client-facing technical discussions, and I've cut a cloud bill by 60% and recovered a compromised AWS account in four hours.",
};

export const metrics = [
  { value: "60%",  label: "Cloud spend reduced",        detail: "Rightsizing, reserved instances, killing idle compute" },
  { value: "300+", label: "Rogue instances terminated", detail: "Across multiple regions during a SEV-1 account compromise" },
  { value: "10+",  label: "Client projects on CI/CD",   detail: "Standardised multi-repo GitHub Actions pattern" },
  { value: "3",    label: "Clouds in production",       detail: "AWS, Azure, GCP — plus Contabo and Linode VPS" },
];

export const stack = [
  { layer: "Cloud",         items: ["AWS (EC2, S3, RDS, Lambda, IAM)", "GCP (Compute Engine, Cloud Run, Load Balancer)", "Azure", "Contabo VPS", "Linode"] },
  { layer: "Orchestration", items: ["Docker", "Kubernetes", "Helm", "ArgoCD"] },
  { layer: "CI/CD",         items: ["GitHub Actions", "GitLab CI/CD", "Jenkins", "GitOps", "GHCR"] },
  { layer: "IaC",           items: ["Terraform"] },
  { layer: "Observability", items: ["Prometheus", "Grafana", "Grafana Loki", "Structured logging", "Docker health checks"] },
  { layer: "Network & Sec", items: ["NGINX", "Cloudflare", "UFW", "SSL/TLS", "Linux hardening", "Secrets management", "IAM & access controls"] },
  { layer: "Runtime",       items: ["Python", "FastAPI", "Bash", "Node.js", "Express.js", "React", "JavaScript (ES6+)"] },
  { layer: "Data",          items: ["MongoDB", "MySQL", "Redis"] },
];

export const experience = [
  {
    company: "GoHashInclude Pvt. Ltd.",
    role: "DevOps Engineer",
    start: "Jan 2026",
    end: "Present",
    current: true,
    points: [
      "Lead a development team — end-to-end delivery, code reviews and technical mentorship — while managing multi-cloud infrastructure across AWS, Azure, GCP and VPS environments.",
      "Own client-facing engagement: requirement-gathering sessions, progress updates and technical discussions that align delivery with business objectives.",
      "Cut cloud infrastructure billing by ~60% through resource rightsizing, reserved instance usage and eliminating idle compute.",
      "Designed and maintained CI/CD pipelines (GitHub Actions, GitOps) and containerised applications with Docker under agile delivery practices.",
      "Manage GitHub repositories, branching strategy (main/development/feature) and pull request reviews to enforce deployment-readiness.",
      "Built the observability stack on Prometheus, Grafana and Grafana Loki — dashboards and alert rules that cut incident response time.",
      "Hardened Linux servers: NGINX reverse proxy, UFW firewall policy, SSL/TLS termination, systemd service management.",
    ],
  },
  {
    company: "InnoSyte",
    role: "Software Engineer (Backend & DevOps)",
    start: "Jan 2025",
    end: "Dec 2025",
    current: false,
    points: [
      "Full-stack developer — designed frontend and backend architecture and shipped features end-to-end in React and Python/FastAPI.",
      "Owned end-to-end deployment of client applications on GCP: Docker containerisation, NGINX reverse proxy, SSL/TLS termination, GitHub Actions CI/CD with Secrets Manager.",
      "Standardised Git branching and release workflows across client repositories, reviewing every pull request for deployment readiness.",
      "Built FastAPI backend services for client e-commerce platforms — product catalogues, order management, Razorpay payments — with JWT auth, RBAC and MongoDB.",
      "Developed React dashboards against FastAPI backends, working the full lifecycle from code to production.",
    ],
  },
];

export const incident = {
  id: "INC-2026-001",
  severity: "SEV-1",
  title: "AWS account compromise",
  summary: "Leaked IAM access keys were used to spin up cryptomining instances across multiple AWS regions. Detected, contained and fully restored in under four hours.",
  impact: [
    { label: "Unauthorised instances", value: "300+" },
    { label: "Regions affected",       value: "Multiple" },
    { label: "Fraudulent billing",     value: "$1,000" },
    { label: "Time to restore",        value: "4 hours" },
  ],
  timeline: [
    { t: "T+00:00", state: "detected",   text: "Anomalous EC2 activity and billing spike identified." },
    { t: "T+00:20", state: "contained",  text: "Leaked IAM access keys revoked; blast radius scoped across regions." },
    { t: "T+01:10", state: "mitigated",  text: "300+ unauthorised EC2 instances identified and terminated." },
    { t: "T+02:30", state: "mitigated",  text: "$1,000 in fraudulent billing raised and disputed with AWS." },
    { t: "T+04:00", state: "resolved",   text: "Production workloads restored. Access controls and key rotation policy tightened." },
  ],
  followUp: "Rotated all credentials, enforced least-privilege IAM policies, and added billing and instance-count alerting so the same signal fires in minutes, not hours.",
};

export const projects = [
  {
    name: "Vistofy.in",
    tagline: "AI-powered design and image editing platform",
    url: "https://vistofy.in",
    role: "Architecture, deployment, migration",
    points: [
      "Designed and deployed a multi-service production platform (Canva-style design tool) as independently containerised services: frontend, backend, Redis, and a custom AI background-removal microservice.",
      "Built the background-removal service in Python on the birefnet-general segmentation model with optional Real-ESRGAN upscaling, running on a dedicated high-memory host with configurable worker allocation.",
      "Migrated frontend and backend from Contabo VPS to GCP while keeping the compute-heavy AI service on Contabo for cost efficiency.",
      "GCP-managed Load Balancer for backend traffic distribution, Cloudflare for CDN, DNS and security, centralised logging through Grafana Loki.",
    ],
    nodes: ["Cloudflare", "GCP Load Balancer", "Frontend", "Backend API", "Redis", "AI Service (Contabo)", "Grafana Loki"],
    tags: ["GCP", "Contabo", "Docker", "Redis", "Cloudflare", "Grafana Loki", "Python"],
  },
  {
    name: "Multi-Repository CI/CD Infrastructure",
    tagline: "One deployment pattern, ten-plus client projects",
    url: "",
    role: "Design and ownership",
    points: [
      "Designed and implemented a standardised CI/CD pattern across 10+ client projects, each with a multi-repository structure (separate frontend and backend repos) and main/development/feature branch workflows.",
      "Owned repository management end to end — created repositories and reviewed every pull request for deployment-readiness before merge.",
      "Built reusable GitHub Actions workflows for automated Docker image builds and deployments, managing secrets and environment configuration independently per project.",
    ],
    nodes: ["Commit", "Build", "Test", "Push GHCR", "Deploy", "Health check"],
    tags: ["GitHub Actions", "Docker", "GHCR", "GitOps"],
  },
];

export const education = [
  { degree: "Master of Computer Applications (MCA)", school: "CMR Institute of Technology", year: "2025", note: "CGPA 8.6" },
  { degree: "Bachelor of Computer Applications (BCA)", school: "Poddar International College", year: "2023", note: "65%" },
];
```

---

## 5. The Lovable prompts

Paste one at a time. Wait for each build to finish and eyeball it before moving on. If a section comes out wrong, fix it *before* adding the next one — errors compound.

---

### Prompt 0 — Foundation

```
Build a single-page personal portfolio site for a DevOps engineer. React + TypeScript
+ Tailwind + Framer Motion. No backend, no auth, no database, no routing — one page.

This prompt sets up ONLY the design system, fonts, theme and empty page shell.
Do not build any sections yet. I will add them one at a time.

CONCEPT
The site presents itself as an infrastructure control plane / status page — not a
marketing landing page. Structure, language and visual states borrow from status
pages, Grafana dashboards and incident postmortems. Restrained and precise, with one
bold moment later.

COLOUR TOKENS — define as CSS custom properties on :root in index.css, and expose them
to Tailwind via the theme config. Do not hardcode hex values in components.

  --bg          #0E1116
  --surface     #151A21
  --surface-hi  #1B2129
  --hairline    #262E38
  --text        #E7E4DD
  --text-dim    #8A94A0
  --accent      #F2A93B
  --ok          #46B98A
  --warn        #F2A93B
  --crit        #E0555A
  --grid        rgba(255,255,255,0.035)

Also define an alternate token set under the class `.theme-incident` on <html>:
  --bg #12080A · --surface #1A0C0F · --hairline #3A1A1E · --accent #E0555A
  --grid rgba(224,85,90,0.06)
All token changes must transition over 600ms cubic-bezier(0.16,1,0.3,1).

TYPOGRAPHY — load IBM Plex Mono (400,500,600) and IBM Plex Sans (400,500) from Google
Fonts.
  Display  : IBM Plex Mono 600, clamp(3.5rem, 9vw, 8.75rem), tracking -0.03em, line-height 0.92
  Section  : IBM Plex Mono 500, clamp(2rem, 4vw, 3.25rem), tracking -0.02em
  Eyebrow  : IBM Plex Mono 500, 11px, uppercase, letter-spacing 0.18em, colour --text-dim
  Body     : IBM Plex Sans 400, 17px, line-height 1.65, max-width 62ch
  Data     : IBM Plex Mono 400 with font-variant-numeric: tabular-nums
Headings are set in the MONO face, not the sans. This is deliberate.

LAYOUT SHELL
- Max content width 1240px, 24px gutters.
- Fixed left rail, 220px wide, desktop only (>=1024px): my initials at top; a vertical
  section index (00 HERO / 01 SYSTEM / 02 STACK / 03 LOG / 04 INCIDENT / 05 ARCHITECTURE
  / 06 ENDPOINTS) where the active item is highlighted in --accent as you scroll; at the
  bottom a pulsing dot in --ok with the label "OPERATIONAL", a live clock in Asia/Kolkata,
  and the text "JAIPUR, IN".
- Under 1024px the rail becomes a slim sticky top bar with just the status dot and a
  section label.
- A fixed full-viewport hairline grid overlay behind all content: 1px lines in --grid at
  80px intervals, pointer-events none, z-index 0.
- Corner radius maximum 4px anywhere on the site.
- All section headers are LEFT-ALIGNED with an eyebrow above (e.g. "01 / SYSTEM OVERVIEW").
  Nothing on this site is centre-aligned.

MOTION
- One easing curve everywhere: cubic-bezier(0.16, 1, 0.3, 1).
- Scroll reveals use IntersectionObserver, translateY(16px) + opacity, 500ms, fire once
  and never re-trigger.
- Full prefers-reduced-motion support: disable all transforms and the theme transition,
  render everything in its final state.
- Visible keyboard focus rings in --accent on every interactive element.

DO NOT USE, under any circumstances:
purple/blue gradient backgrounds · glassmorphism or backdrop-blur · particle effects ·
emoji · centred hero text · rounded-2xl · neon glow on text · animated gradient borders ·
skill percentage bars · stock imagery · "Hi, I'm" or "Let's work together" copy.

Output: the token system, fonts, left rail, grid overlay, and seven empty <section>
elements with correct ids and eyebrow labels. Nothing else.
```

---

### Prompt 1 — Content file

Paste the entire `content.ts` block from section 4, prefixed with:

```
Create src/data/content.ts with exactly this content. Do not modify, embellish, shorten
or add to any of it — every fact is real and must stay verbatim. From here on, all UI
text comes from this file. Never hardcode content in a component.
```

---

### Prompt 2 — Hero

```
Build section 00, the hero. Full viewport height, content left-aligned, vertically
centred, starting at the left rail edge.

Load sequence, orchestrated once on mount, ~1.4s total:

1. A boot log types out line by line in IBM Plex Mono 13px, colour --text-dim, each line
   appearing 120ms after the last:
     > initialising control plane...
     > loading profile: piyush.sharma
     > region: ap-south-1 (jaipur)
     > status: OK
   Prefix each completed line with a "✓" in --ok.

2. The boot log then collapses upward and the name replaces it: "PIYUSH SHARMA" in the
   display style — IBM Plex Mono 600, clamp(3.5rem, 9vw, 8.75rem), tracking -0.03em,
   uppercase, colour --text. It should feel like it snaps into place, not fade in.

3. Directly beneath, one line in IBM Plex Mono 500, 15px, uppercase, letter-spacing
   0.14em: "DEVOPS ENGINEER" in --text, then a hairline separator dot, then
   "MULTI-CLOUD · CI/CD · OBSERVABILITY" in --text-dim.

4. A status strip fades in below: a pulsing 6px dot in --ok, the text
   "ALL SYSTEMS OPERATIONAL", a vertical hairline divider, then a live uptime counter
   in tabular mono that counts up from profile.careerStart in the format
   "UPTIME 1y 7mo 06d 14:32:09", ticking every second.

5. Two actions, last to appear:
   - Primary: "VIEW WORK" — 1px --accent border, transparent fill, --accent text,
     4px radius, IBM Plex Mono 13px uppercase tracking 0.1em. On hover the fill becomes
     --accent and the text --bg. Scrolls to section 05.
   - Secondary: "RESUME.PDF" — 1px --hairline border, --text-dim text, same dimensions.
     Downloads profile.resumeUrl. On hover the border becomes --text-dim.

No background gradient, no blob, no particles, no image. The hairline grid overlay is
the only background. The type and the boot sequence carry the whole hero.
```

---

### Prompt 3 — System overview + stack

```
Build sections 01 and 02.

SECTION 01 — SYSTEM OVERVIEW
Two-column layout at >=900px, stacked below.
Left column (7/12): eyebrow "01 / SYSTEM OVERVIEW", then profile.bio in IBM Plex Sans
17px, line-height 1.65, max-width 62ch, colour --text.
Right column (5/12): a 2x2 grid of metric tiles from the metrics array. Each tile:
background --surface, 1px --hairline border, 4px radius, padding 20px. Inside, the value
in IBM Plex Mono 600 at 44px with tabular-nums and colour --accent, the label beneath in
11px uppercase mono, letter-spacing 0.14em, colour --text-dim. On hover the border
becomes --accent and the `detail` string reveals below the label in 12px --text-dim.
When the tiles scroll into view, each value counts up from 0 to its final number over
900ms, staggered 80ms apart. Non-numeric parts of the value ("%", "+") stay static.

SECTION 02 — STACK
Eyebrow "02 / STACK". Do NOT build a logo grid or skill percentage bars.
Render the stack array as a layered topology: one horizontal band per layer, stacked
vertically, each band being a row of items.
Each band: on the left, a fixed 140px column with the layer name in 11px uppercase mono,
letter-spacing 0.14em, colour --text-dim, and a 1px --hairline vertical rule to its right.
To the right, the items as small chips — 1px --hairline border, 4px radius, padding
6px 12px, IBM Plex Mono 13px, colour --text.
Bands are separated by a 1px --hairline horizontal rule with 28px padding above and below.
On chip hover: border becomes --accent, text becomes --accent, and every other chip on the
page drops to 35% opacity for 200ms — so hovering one thing dims the rest of the system.
That dimming behaviour is the point of this section; make sure it works.
```

---

### Prompt 4 — Deployment log (experience)

```
Build section 03, "DEPLOYMENT LOG" — my work experience, rendered as deployment records.

Eyebrow "03 / DEPLOYMENT LOG".

Above the entries, a horizontal CI/CD pipeline diagram: six nodes connected by 1px
--hairline lines — COMMIT → BUILD → TEST → PUSH GHCR → DEPLOY → HEALTH CHECK. Each node
is a small 4px-radius box, --surface fill, 1px --hairline border, label in 10px uppercase
mono. When the section enters the viewport, a 2px --accent segment travels left to right
along the connecting lines over 2.4s, lighting each node's border in --accent as it passes
and leaving it in --ok once passed. It runs once, then the final node shows a --ok dot.
Build this with SVG and Framer Motion (animate strokeDashoffset) — do not use a video,
image or third-party library.

Below that, the experience array as records, most recent first. Each record:
- Left gutter (120px): the date range in mono 12px, --text-dim, and for the current role
  a small pill reading "ACTIVE" in --ok with a 1px --ok border.
- Main column: role in IBM Plex Mono 500 at 22px in --text; company beneath in 14px mono
  --text-dim. Then the points array as a list — each item prefixed with a 1px --hairline
  vertical tick rather than a bullet, IBM Plex Sans 16px, line-height 1.6, --text-dim,
  with any number in the text (60%, 300+) wrapped in a span coloured --accent with
  tabular-nums.
- Records separated by a full-width 1px --hairline rule, 48px padding above and below.

No cards, no shadows, no rounded containers. This is a log, not a set of tiles.
```

---

### Prompt 5 — Incident report (THE SIGNATURE — do this one carefully)

```
Build section 04, the incident report. This is the centrepiece of the site — give it the
most attention. Content comes from the `incident` object.

THEME FLIP
When this section crosses 40% of the viewport, add the class `theme-incident` to <html>;
remove it when the section leaves. All colour tokens transition over 600ms
cubic-bezier(0.16,1,0.3,1), so the entire page — rail, grid, every other element —
shifts to the alert palette. Under prefers-reduced-motion, skip the flip entirely and
render this section with the incident palette applied locally only.

LAYOUT
Eyebrow "04 / INCIDENT REPORT". Beside it, right-aligned, a severity badge: "SEV-1" in
mono 11px uppercase, 1px --crit border, --crit text, 4px radius, and a slow 2s pulse on
the border opacity. Below the eyebrow: incident.id in mono 12px --text-dim, then
incident.title as a section heading, then incident.summary in IBM Plex Sans 17px,
max-width 62ch.

THE CHART
A full-width area chart, 260px tall, drawn in raw SVG. X axis is the 4-hour incident
window, Y axis is unauthorised instance count. The curve starts flat at ~12, spikes
steeply to 300+ around the 20% mark, plateaus, then drops back to 12 by the right edge.
Stroke 2px --crit, fill --crit at 8% opacity. Y-axis gridlines are 1px --hairline with
labels in mono 10px --text-dim. When the section enters view, the path draws left to
right over 2.2s (animate strokeDashoffset) and the fill area wipes in behind it. At the
peak, a small dot with a label "300+ instances" in mono 11px --crit.

THE TIMELINE
Directly under the chart, a horizontal timeline with a node for each entry in
incident.timeline. Each node: the `t` value in mono 11px --text-dim above, a 8px dot
below, and the text beneath in IBM Plex Sans 14px, max-width 180px.
Dot colour by state: detected and contained → --crit, mitigated → --warn, resolved → --ok.
Nodes are connected by a 1px --hairline line. When the section enters view, the nodes
illuminate in sequence, 400ms apart, with the connecting line filling between them in the
colour of the node just reached. The final node reaching "resolved" flips the SEV-1 badge
to a "RESOLVED" badge in --ok, with a crossfade.

IMPACT STRIP
A row of four figures from incident.impact — value in IBM Plex Mono 600 at 36px with
tabular-nums, label beneath in 11px uppercase mono --text-dim. Separated by 1px --hairline
vertical rules.

FOLLOW-UP
Finally, incident.followUp in a block with a 2px --ok left border, 20px left padding, in
IBM Plex Sans 16px --text-dim, preceded by an eyebrow "FOLLOW-UP ACTIONS".

Build the chart and timeline yourself in SVG with Framer Motion. Do not pull in Recharts
or any charting library for this.
```

---

### Prompt 6 — Architecture (projects)

```
Build section 05, "ARCHITECTURE" — my projects, presented as system diagrams rather than
project cards. Content from the `projects` array.

Eyebrow "05 / ARCHITECTURE".

For each project, a full-width block with two parts:

LEFT (5/12): project.name in IBM Plex Mono 500 at 28px; project.tagline beneath in 14px
mono --text-dim; project.role in 11px uppercase mono --text-dim; then project.points as
a list with hairline ticks (same treatment as the deployment log); then project.tags as
chips (same chip style as the stack section). If project.url is non-empty, a link at the
bottom reading the bare hostname in --accent with a small external-link arrow.

RIGHT (7/12): an SVG system diagram built from project.nodes. Each node is a 4px-radius
box, --surface fill, 1px --hairline border, label in 11px mono --text. Connect them with
1px --hairline lines in a sensible topology — for Vistofy, a branching architecture with
Cloudflare at the top feeding the load balancer, which fans out to frontend and backend,
with backend connecting to Redis and the AI service, and Loki collecting from everything.
For the CI/CD project, a straight left-to-right chain.
On node hover: the node border and label go --accent, its connected edges go --accent,
and unconnected nodes drop to 35% opacity. A small tooltip in mono 11px shows where that
service runs (e.g. "Contabo · high-memory host").
On section enter, the diagram draws itself: edges animate in over 1.2s, then nodes fade
in staggered by 60ms.

Alternate the left/right order between the two projects so the page doesn't feel like a
repeating template. Separate them with a full-width 1px --hairline rule and 80px padding.
```

---

### Prompt 7 — Endpoints, footer, command palette, terminal

```
Build section 06 and the two interactive extras.

SECTION 06 — ENDPOINTS
Eyebrow "06 / ENDPOINTS". A heading in the display style: "OPEN TO WORK" — do not write
"Let's work together" or "Get in touch".
Beneath it, contact rows styled like a config table: each row is a 1px --hairline bottom
border, with the key on the left in 11px uppercase mono --text-dim (EMAIL / LINKEDIN /
GITHUB / RESUME / LOCATION) and the value on the right in IBM Plex Mono 15px --text.
Email, LinkedIn, GitHub and Resume are links; on hover the value goes --accent and a small
arrow slides in. Location is static text: "Jaipur, Rajasthan, India · IST (UTC+5:30)".
No contact form — a form is friction and I have no backend.

FOOTER
The education array as two compact rows: degree in mono 14px --text, school and year in
12px --text-dim, note (CGPA/percentage) right-aligned in mono --text-dim.
Below that, a status line: pulsing --ok dot, "ALL SYSTEMS OPERATIONAL", a hairline
divider, the live uptime counter, a hairline divider, and "BUILT AND DEPLOYED BY PIYUSH
SHARMA". All in mono 11px uppercase, letter-spacing 0.14em.

COMMAND PALETTE
Cmd+K / Ctrl+K opens a centred palette: 560px wide, --surface background, 1px --hairline
border, 4px radius, a text input at top in IBM Plex Mono, and a filtered list beneath.
Each result has a mono label and a right-aligned category tag in --text-dim. Arrow keys
navigate, Enter runs, Escape closes, and the highlighted row has a --accent left border.
Commands:
  goto hero / system / stack / experience / incident / projects / contact  → smooth scroll
  open resume        → download resume PDF
  open linkedin      → open LinkedIn
  open github        → open GitHub
  copy email         → copy address to clipboard, show a "copied" toast in --ok
  toggle motion      → disable/enable all animations
A small hint sits in the bottom-right corner of the viewport at all times: a "⌘K" key cap
in mono 11px with a 1px --hairline border.

TERMINAL EASTER EGG
Pressing the "~" key (when not focused in an input) slides a terminal panel up from the
bottom, 320px tall, --surface background, 1px --hairline top border, monospace throughout,
with a prompt reading "piyush@control-plane:~$". Supported commands:
  help      → list available commands
  whoami    → "piyush sharma — devops engineer, jaipur, in"
  ls        → "overview  stack  experience  incident.log  projects  contact"
  cat incident.log  → prints the incident timeline as log lines with coloured severity tags
  uptime    → prints the live career uptime string
  skills    → prints the stack grouped by layer
  clear     → clears the buffer
  exit      → closes the terminal
Unknown input prints: "command not found: <input>. try 'help'".
Escape also closes it. Keep the implementation simple — a string array as the buffer.
```

---

### Prompt 8 — Polish and QA pass

```
Final pass. Do not add features. Fix the following:

RESPONSIVE
- Test at 375px, 768px, 1024px, 1440px, 1920px. Nothing may overflow horizontally at any
  width. The display type must scale down so "PIYUSH SHARMA" never wraps mid-word on mobile.
- Below 1024px: left rail becomes a sticky top bar. Below 768px: metric tiles go single
  column; the incident timeline becomes vertical; project diagrams stack below their text
  and scale to fit; the terminal takes 60vh.
- Hide the ⌘K hint on touch devices.

ACCESSIBILITY
- Every interactive element reachable by keyboard with a visible --accent focus ring.
- prefers-reduced-motion genuinely disables the theme flip, the chart draw, the counters,
  the pipeline beam and all scroll reveals — everything renders in its final state.
- Contrast: --text-dim on --surface must pass 4.5:1. Raise the lightness if it doesn't.
- Semantic landmarks, one h1, sequential h2s, and alt text or aria-hidden on every SVG.

PERFORMANCE
- Self-host or preload the two fonts with font-display: swap. No FOUT flash.
- Lazy-mount the incident chart, project diagrams and the terminal — they should not run
  until they're needed.
- Target Lighthouse 95+ on performance and accessibility.

SEO AND META
- Title: "Piyush Sharma — DevOps Engineer"
- Description: "DevOps engineer in Jaipur. Multi-cloud infrastructure, CI/CD, Kubernetes
  and observability. Cut cloud spend 60% and recovered a compromised AWS account in four
  hours."
- Open Graph and Twitter card tags with an og:image.
- JSON-LD Person schema with name, jobTitle, address, email, sameAs (LinkedIn, GitHub).
- A favicon: the letter "P" in IBM Plex Mono on the --bg colour.

CONTENT AUDIT
Go through every string rendered anywhere on the site and confirm it comes from
src/data/content.ts. If you find any invented company name, metric, date, job title or
project detail that isn't in that file, delete it. Do not paraphrase my bullet points.
```

---

## 6. Where Lovable will struggle, and what to do

Realistic expectations. Lovable generates React + Tailwind + shadcn well, so most of this is within reach — but three things are genuinely hard for it:

| Risk | Likelihood | Fix |
|---|---|---|
| **The theme flip fires erratically** — retriggers, flickers at section boundaries, or doesn't clean up | High | Ask it to use a single `IntersectionObserver` with `rootMargin: "-40% 0px -40% 0px"` and a `useRef` guard so the class toggles at most once per direction. If it still misbehaves, scope the incident palette to the section only and drop the page-wide flip — the section still lands. |
| **The SVG chart and pipeline beam** — Lovable often reaches for Recharts and gives you a generic dashboard chart | High | The prompts say "raw SVG, no charting library". If it ignores that, tell it: *"Replace the Recharts chart with a hand-written SVG path animated via Framer Motion's strokeDashoffset. I want one path, not a chart component."* |
| **The terminal** | Medium | Cut it if it fights you. It's the least important element here. The command palette matters more. |
| **Invented content** | Certain, if you skip Prompt 1 | Always paste `content.ts` before any section. Re-run the content audit in Prompt 8. |
| **Drift back to defaults** — gradients, glassmorphism, rounded cards creeping in | Certain over many iterations | Keep the "do not use" list handy and paste it again whenever you ask for a change. |

**Aceternity components:** you can absolutely lift specific ones — they're MIT-licensed copy-paste files that expect Tailwind + Framer Motion, which is exactly Lovable's stack. Worth pulling: the **animated beam** for the pipeline, and **glowing effect** for card borders if you want it. Skip Aurora Background, Background Beams, Spotlight and Meteors entirely — those are the four that make a site instantly recognisable as an Aceternity template, which is the opposite of what you want.

---

## 7. If you'd rather build it manually

Honestly worth considering, given "build once, never touch again." Lovable is fastest to a first draft, but you'll spend real credits fighting it toward this specific design, and you're a DevOps engineer — you can ship this yourself and it becomes a portfolio piece in itself.

**Stack:** Vite + React + TypeScript + Tailwind + Framer Motion. No Next.js — you have no server needs, and a static Vite build deploys anywhere.

**Approximate effort:** two focused weekends. Foundation and hero in an evening, stack and experience in another, the incident section is a full day on its own (it's the hard part and the valuable part), projects and polish in one more.

**A hybrid that works well:** generate the foundation, hero, stack and experience in Lovable, export the code to GitHub, then hand-build the incident section and command palette yourself in your editor. You get Lovable's speed on the boilerplate and full control over the one section that actually matters.

**Deploy:** Cloudflare Pages or Vercel, both free, both with automatic deploys from GitHub. Given your Cloudflare experience, Pages is the natural pick — and "deployed on Cloudflare Pages behind my own CI" is a better line in an interview than "built with a no-code tool."

---

## 8. Ship checklist

- [ ] Fill in `linkedin` and `github` in `content.ts` — they're blank placeholders right now
- [ ] Put your resume PDF in `/public/Piyush_Sharma_Resume_DevOps.pdf`
- [ ] Decide on the phone number. **I left it out deliberately** — a public page with your mobile on it attracts recruiter spam and scrapers indefinitely. Email plus LinkedIn is enough; anyone serious will use them.
- [ ] Buy a domain. `piyushsharma.dev` or `piyush.sh` — `.sh` is a nice fit for what you do
- [ ] Create an OG image (1200×630) — the hero screenshot works fine
- [ ] Run Lighthouse; fix anything under 90
- [ ] Test on a real phone, not just the browser device emulator
- [ ] Tab through the entire page with the keyboard
- [ ] Enable reduced motion in your OS settings and reload — confirm nothing breaks
- [ ] Add the URL to your LinkedIn headline and your resume header
- [ ] Set a calendar reminder for six months out to update the metrics — that's the only maintenance this needs
