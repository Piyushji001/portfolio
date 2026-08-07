# PORTFOLIO_SPEC.md

**Authoritative build specification for `piyush.sh` — a personal portfolio site for a DevOps engineer.**

This document is the single source of truth for the implementing agent. Every design token, every string, every acceptance criterion lives here. If this document and your own judgement disagree, this document wins. If something is genuinely unspecified, apply the defaults in §1.4 and note the decision in `DECISIONS.md` — do not stop and ask.

- **Human reader:** start at §0. It tells you what to run before handing this to the agent.
- **Agent reader:** read §1 through §4 in full before writing any code. Then execute §5 tasks in order, gating each one on its acceptance criteria.

---

## §0 — Setup (human does this once)

### 0.1 Create the project

```bash
mkdir piyush-portfolio && cd piyush-portfolio
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install motion
git init && git add -A && git commit -m "chore: scaffold vite + react + ts"
```

`motion` is the current package name for Framer Motion. Import from `"motion/react"`.

### 0.2 Drop the docs in

```
piyush-portfolio/
├── AGENTS.md                  ← the short always-on rules file (see §0.3)
├── docs/
│   └── PORTFOLIO_SPEC.md      ← this file
├── src/
└── public/
```

### 0.3 Create `AGENTS.md` at the project root

Copy the contents of the `AGENTS.md` file supplied alongside this spec. It's deliberately short — Antigravity caps rules files at 12,000 characters, and it exists only to establish the hard rules and point the agent here.

If you also want it as an activated workspace rule, place a copy at `.agents/rules/portfolio.md` and set its activation mode to **Always On** in Antigravity's Customizations panel.

### 0.4 Add your assets

Put these in `public/` before starting:

- `Piyush_Sharma_Resume_DevOps.pdf` — your resume, exact filename
- `og.png` — 1200×630 social preview image (can be added later, §5 T9 will remind you)

### 0.5 Fill in the two blanks

Open §4 of this document and replace the empty `linkedin` and `github` strings with your real URLs **before** the agent starts. It cannot invent these and will leave them broken if you don't.

### 0.6 Kick off in Antigravity

Open the folder, then prompt:

> Read `docs/PORTFOLIO_SPEC.md` in full. Then execute tasks T0 through T9 in order. After each task, verify against its acceptance criteria, run `npm run build`, and stop for my review before starting the next task.

Working task-by-task with a review gate is deliberate. Letting an agent run all ten tasks unattended on a design-heavy build produces drift that's more expensive to unwind than it was to prevent.

---

## §1 — Agent operating rules

### 1.1 Non-negotiables

1. **All user-facing content comes from `src/data/content.ts`.** Never hardcode a name, metric, date, company, bullet point or project detail into a component. If a string is needed that isn't in the content file, add it to the content file first.
2. **Never invent facts.** Every number, employer, date and technology in §4 is real and belongs to a real person. Do not embellish, round, rephrase, add a bullet, or "improve" a claim. Do not add projects, skills, certifications or testimonials that are not in §4.
3. **Never hardcode a colour.** Every colour is a CSS custom property defined in §3.1. No hex literals in components.
4. **One easing curve site-wide:** `cubic-bezier(0.16, 1, 0.3, 1)`.
5. **`prefers-reduced-motion` must genuinely work.** Not a token gesture — every transform, counter, path-draw and theme transition disabled, with all content rendered in its final state.
6. **No new dependencies** beyond those in §2.2 without recording the reason in `DECISIONS.md`. In particular: no charting library, no animation library other than `motion`, no UI kit, no icon package.
7. **Single page.** No router, no backend, no database, no auth, no CMS, no contact form.
8. **Run `npm run build` after every task.** A task is not done if the build fails or emits TypeScript errors.

### 1.2 Deny list

These are the defaults an AI will drift toward. All are forbidden in this project:

| Forbidden | Forbidden | Forbidden |
|---|---|---|
| purple/blue gradient backgrounds | glassmorphism, `backdrop-blur` | particle fields |
| emoji anywhere in the UI | centred hero or section headers | `rounded-lg` / `rounded-xl` / `rounded-2xl` |
| neon glow on text | animated gradient borders | skill percentage bars |
| stock photos or illustrations | "Hi, I'm…" copy | "Let's work together" / "Get in touch" copy |
| rotating typewriter job titles | logo-soup skill grids | decorative 3D tilt cards |
| box shadows of any kind | `<form>` elements | AI-generated hero imagery |

### 1.3 Tone of UI copy

Terse, technical, lower-drama. The site speaks in the register of a status page, not a marketing page. Sentence case in prose; UPPERCASE only for eyebrows, labels and buttons. No exclamation marks. No first-person marketing voice — the bio in §4 is the only place "I" appears.

### 1.4 Default decisions

When this spec is silent, choose:

- Spacing: multiples of 4px. Section vertical padding `120px` desktop, `72px` mobile.
- Border radius: `4px`. Never more.
- Transition duration: `200ms` for hover, `500ms` for scroll reveal, `600ms` for theme change.
- Breakpoints: `640 / 768 / 1024 / 1280`.
- Any ambiguity between "more animation" and "less animation": choose less.
- Any ambiguity between "more decoration" and "more whitespace": choose whitespace.

Record every such decision as a one-line entry in `DECISIONS.md`.

---

## §2 — Project structure

### 2.1 File tree (create exactly this)

```
src/
├── data/
│   └── content.ts            all site content, from §4
├── lib/
│   ├── useInView.ts          IntersectionObserver hook, fires once
│   ├── useReducedMotion.ts   prefers-reduced-motion hook
│   ├── useUptime.ts          live career uptime string, ticks 1s
│   └── cn.ts                 className joiner
├── components/
│   ├── Rail.tsx              fixed left navigation rail
│   ├── GridOverlay.tsx       hairline schematic grid
│   ├── Eyebrow.tsx           "01 / SYSTEM OVERVIEW" label
│   ├── Reveal.tsx            scroll-reveal wrapper
│   ├── StatusPill.tsx        pulsing dot + label
│   ├── Chip.tsx              bordered tag
│   ├── CommandPalette.tsx    Cmd+K
│   └── Terminal.tsx          ~ easter egg
├── sections/
│   ├── Hero.tsx              00
│   ├── Overview.tsx          01
│   ├── Stack.tsx             02
│   ├── DeploymentLog.tsx     03
│   ├── Incident.tsx          04  ← the signature section
│   ├── Architecture.tsx      05
│   └── Endpoints.tsx         06 + footer
├── App.tsx
├── index.css
└── main.tsx
public/
├── Piyush_Sharma_Resume_DevOps.pdf
└── og.png
DECISIONS.md
```

### 2.2 Dependencies

Runtime: `react`, `react-dom`, `motion`
Build: `vite`, `typescript`, `tailwindcss`, `@tailwindcss/vite`

Nothing else.

### 2.3 Commands

```
npm run dev      local dev server
npm run build    production build — must pass after every task
npm run preview  serve the production build
```

---

## §3 — Design system

The concept: **the site presents itself as an infrastructure control plane.** Structure, language and visual state are borrowed from status pages, Grafana and incident postmortems. Restrained and precise throughout, with exactly one bold moment (§5 T5).

### 3.1 Colour tokens

Declare in `src/index.css` as raw CSS custom properties on `:root`, then bridge into Tailwind v4 with `@theme inline` so the runtime values stay swappable.

```css
@import "tailwindcss";

:root {
  --ink:       #0E1116;   /* page canvas — blue-slate, deliberately not black */
  --surface:   #151A21;
  --surface-hi:#1B2129;
  --hairline:  #262E38;
  --fg:        #E7E4DD;   /* warm bone against cool slate — intentional tension */
  --fg-dim:    #8A94A0;
  --accent:    #F2A93B;   /* signal amber — pager light, WARN log line */
  --ok:        #46B98A;
  --warn:      #F2A93B;
  --crit:      #E0555A;
  --grid:      rgba(255,255,255,0.035);

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html.theme-incident {
  --ink:      #12080A;
  --surface:  #1A0C0F;
  --surface-hi:#221013;
  --hairline: #3A1A1E;
  --accent:   #E0555A;
  --grid:     rgba(224,85,90,0.06);
}

@theme inline {
  --color-ink:       var(--ink);
  --color-surface:   var(--surface);
  --color-surface-hi:var(--surface-hi);
  --color-hairline:  var(--hairline);
  --color-fg:        var(--fg);
  --color-fg-dim:    var(--fg-dim);
  --color-accent:    var(--accent);
  --color-ok:        var(--ok);
  --color-warn:      var(--warn);
  --color-crit:      var(--crit);
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --font-sans: "IBM Plex Sans", system-ui, sans-serif;
}

html {
  transition: none;
}
html, body {
  background: var(--ink);
  color: var(--fg);
}
```

Every element that consumes a themed colour must transition it:

```css
.themed {
  transition: background-color 600ms var(--ease),
              border-color 600ms var(--ease),
              color 600ms var(--ease);
}
```

Apply `.themed` to the body, rail, grid overlay, and any bordered surface. Under `prefers-reduced-motion: reduce`, set all these transitions to `none`.

**Why this palette:** near-black plus a single acid-green accent is the default every AI builder produces, and blue-to-violet gradients are the signature of the component library this site must not resemble. A cool blue-slate base with signal amber is specific to the subject — amber is the colour of a warning state in every monitoring tool the subject works in. Status hues (`--ok`, `--crit`) appear **only** where they are semantically true. Never use `--ok` as a decorative accent.

### 3.2 Typography

Load from Google Fonts: **IBM Plex Mono** (400, 500, 600) and **IBM Plex Sans** (400, 500). Preload both with `font-display: swap`.

IBM Plex Mono is the **display face**, not a decorative accent. Headlines are set in mono at large sizes. This is deliberate and central to the design — do not substitute Inter, Geist, Space Grotesk or any sans for headings.

| Role | Spec |
|---|---|
| Display | Plex Mono 600 · `clamp(3.5rem, 9vw, 8.75rem)` · tracking `-0.03em` · leading `0.92` · uppercase |
| Section heading | Plex Mono 500 · `clamp(2rem, 4vw, 3.25rem)` · tracking `-0.02em` |
| Eyebrow | Plex Mono 500 · `11px` · uppercase · tracking `0.18em` · `--fg-dim` |
| Sub-label | Plex Mono 500 · `13px` · uppercase · tracking `0.14em` |
| Body | Plex Sans 400 · `17px` · leading `1.65` · `max-width: 62ch` |
| UI / data | Plex Mono 400 · `13–15px` · `font-variant-numeric: tabular-nums` |
| Metric numeral | Plex Mono 600 · `36–44px` · tabular-nums · `--accent` |

`font-variant-numeric: tabular-nums` is mandatory on every animated counter. Proportional numerals jitter while counting and make the site look broken.

### 3.3 Layout

- Content max-width `1240px`, gutters `24px`.
- **Fixed left rail**, `220px`, at `≥1024px` only. Contains, top to bottom: initials `PS` in mono; a vertical section index; at the bottom a pulsing `--ok` dot with `OPERATIONAL`, a live `Asia/Kolkata` clock, and `JAIPUR, IN`. The active section index item is `--accent`; the rest are `--fg-dim`.
- Below `1024px` the rail collapses to a slim sticky top bar carrying only the status dot and the current section label.
- **Hairline grid overlay:** fixed, full-viewport, `1px` lines in `--grid` at `80px` intervals both axes, `pointer-events: none`, `z-index: 0`, all content above it. This is the only background treatment on the site.
- **Everything is left-aligned.** No centred heroes, no centred section headers, no centred CTAs. Centred layouts are the single strongest signal that a site came from a template.
- Sections separated by full-width `1px` `--hairline` rules, not by cards or panels.

### 3.4 Motion

- **Page load:** one orchestrated sequence, ~1.4s total, then the page is completely still. Grid draws → rail slides in from the left → hero boot log types → status strip snaps in. Not four independent fade-ins.
- **Scroll:** `IntersectionObserver`, `translateY(16px)` → `0` plus opacity, `500ms`, `threshold: 0.15`, fires **once** and never re-triggers on scroll-up.
- **Hover:** `200ms`, colour and border only. No scale, no lift, no shadow.
- **Reduced motion:** disable everything above. Content renders in its final state on first paint. The theme flip in T5 does not run.

---

## §4 — Content data

Create `src/data/content.ts` with exactly this. Do not modify, embellish, shorten, reorder or add to any of it.

```ts
export const profile = {
  name: "Piyush Sharma",
  role: "DevOps Engineer",
  experience: "1.7+ years",
  location: "Jaipur, Rajasthan, India",
  timezone: "Asia/Kolkata",
  careerStart: "2025-01-01",
  email: "mr.piyush0270@gmail.com",
  linkedin: "",   // TODO(human): paste LinkedIn URL before build
  github: "",     // TODO(human): paste GitHub URL before build
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
  summary: "Leaked IAM access keys were used to spin up unauthorised compute across multiple AWS regions. Detected, contained and fully restored in under four hours.",
  impact: [
    { label: "Unauthorised instances", value: "300+" },
    { label: "Regions affected",       value: "Multiple" },
    { label: "Fraudulent billing",     value: "$1,000" },
    { label: "Time to restore",        value: "4 hours" },
  ],
  timeline: [
    { t: "T+00:00", state: "detected",  text: "Anomalous EC2 activity and billing spike identified." },
    { t: "T+00:20", state: "contained", text: "Leaked IAM access keys revoked; blast radius scoped across regions." },
    { t: "T+01:10", state: "mitigated", text: "300+ unauthorised EC2 instances identified and terminated." },
    { t: "T+02:30", state: "mitigated", text: "$1,000 in fraudulent billing raised and disputed with AWS." },
    { t: "T+04:00", state: "resolved",  text: "Production workloads restored. Access controls and key rotation policy tightened." },
  ],
  followUp: "Rotated all credentials, enforced least-privilege IAM policies, and added billing and instance-count alerting so the same signal fires in minutes, not hours.",
  // Curve for the chart: [x 0-1, unauthorised instance count]
  curve: [[0,12],[0.12,14],[0.18,90],[0.24,240],[0.30,312],[0.46,318],[0.55,300],[0.68,180],[0.80,64],[0.92,18],[1,12]],
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
    tags: ["GCP", "Contabo", "Docker", "Redis", "Cloudflare", "Grafana Loki", "Python"],
    diagram: {
      nodes: [
        { id: "cf",   label: "Cloudflare",   host: "Edge · CDN, DNS, WAF" },
        { id: "lb",   label: "Load Balancer", host: "GCP · managed" },
        { id: "fe",   label: "Frontend",      host: "GCP · container" },
        { id: "be",   label: "Backend API",   host: "GCP · container" },
        { id: "redis",label: "Redis",         host: "GCP · container" },
        { id: "ai",   label: "AI Service",    host: "Contabo · high-memory host" },
        { id: "loki", label: "Grafana Loki",  host: "Centralised logging" },
      ],
      edges: [["cf","lb"],["lb","fe"],["lb","be"],["be","redis"],["be","ai"],["fe","loki"],["be","loki"],["ai","loki"]],
    },
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
    tags: ["GitHub Actions", "Docker", "GHCR", "GitOps"],
    diagram: {
      nodes: [
        { id: "commit", label: "Commit",       host: "feature → development" },
        { id: "build",  label: "Build",        host: "GitHub Actions runner" },
        { id: "test",   label: "Test",         host: "Automated checks" },
        { id: "push",   label: "Push GHCR",    host: "Container registry" },
        { id: "deploy", label: "Deploy",       host: "Target environment" },
        { id: "health", label: "Health check", host: "Docker healthcheck" },
      ],
      edges: [["commit","build"],["build","test"],["test","push"],["push","deploy"],["deploy","health"]],
    },
  },
];

export const education = [
  { degree: "Master of Computer Applications (MCA)", school: "CMR Institute of Technology", year: "2025", note: "CGPA 8.6" },
  { degree: "Bachelor of Computer Applications (BCA)", school: "Poddar International College", year: "2023", note: "65%" },
];

export const nav = [
  { id: "hero",         index: "00", label: "HERO" },
  { id: "overview",     index: "01", label: "SYSTEM OVERVIEW" },
  { id: "stack",        index: "02", label: "STACK" },
  { id: "log",          index: "03", label: "DEPLOYMENT LOG" },
  { id: "incident",     index: "04", label: "INCIDENT REPORT" },
  { id: "architecture", index: "05", label: "ARCHITECTURE" },
  { id: "endpoints",    index: "06", label: "ENDPOINTS" },
];
```

**Deliberate omissions.** The phone number from the source resume is excluded — a public page carrying a mobile number collects scraper spam permanently. The incident section names no employer or client; it is framed entirely as the subject's response. Do not add either back in.

---

## §5 — Build tasks

Execute in order. Each task gates on its acceptance criteria and a passing `npm run build`.

---

### T0 — Foundation

**Goal:** design tokens, fonts, layout shell, empty sections. No content yet.

**Files:** `index.css`, `App.tsx`, `main.tsx`, `components/GridOverlay.tsx`, `components/Rail.tsx`, `components/Eyebrow.tsx`, `components/Reveal.tsx`, `lib/useInView.ts`, `lib/useReducedMotion.ts`, `lib/cn.ts`, `data/content.ts`

**Do:**
1. Create `data/content.ts` from §4 verbatim. This is the first file written.
2. Wire `@tailwindcss/vite` into `vite.config.ts`.
3. Write `index.css` exactly per §3.1, plus the type scale from §3.2 as utility classes (`.t-display`, `.t-section`, `.t-eyebrow`, `.t-sublabel`, `.t-body`, `.t-data`, `.t-metric`).
4. Link IBM Plex Mono and IBM Plex Sans with `preconnect` and `display=swap`.
5. `GridOverlay` — fixed, full viewport, 80px hairline grid, `pointer-events-none`, `z-0`.
6. `Rail` — per §3.3. Active section tracked by `IntersectionObserver` over the seven section ids from `nav`. Collapses to a sticky top bar below `1024px`.
7. `Reveal` — wrapper implementing the §3.4 scroll reveal, once-only, reduced-motion aware.
8. `App.tsx` — renders `GridOverlay`, `Rail`, and seven empty `<section>` elements with the correct ids, each carrying an `Eyebrow`.

**Acceptance criteria:**
- [ ] `npm run build` passes with zero TypeScript errors.
- [ ] Zero hex colour literals exist anywhere outside `index.css`.
- [ ] Both fonts render; no fallback flash on hard reload.
- [ ] Scrolling updates the active item in the rail.
- [ ] At 375px width nothing overflows horizontally; the rail is a top bar.
- [ ] Toggling `.theme-incident` on `<html>` in devtools recolours the entire page over 600ms.

---

### T1 — Hero (section 00)

**Goal:** full-viewport hero with an orchestrated load sequence.

**File:** `sections/Hero.tsx`

**Do:** full viewport height, content left-aligned at the rail edge, vertically centred. Sequence, once on mount, ~1.4s total:

1. A boot log types line by line in Plex Mono 13px `--fg-dim`, each line appearing 120ms after the last. Completed lines are prefixed `✓` in `--ok`:
   ```
   initialising control plane...
   loading profile: piyush.sharma
   region: ap-south-1 (jaipur)
   status: OK
   ```
2. The log collapses upward and `PIYUSH SHARMA` replaces it in the display style — it should **snap** into place, not fade.
3. Beneath: `DEVOPS ENGINEER` in sub-label style `--fg`, a hairline dot separator, then `MULTI-CLOUD · CI/CD · OBSERVABILITY` in `--fg-dim`.
4. Status strip: pulsing 6px `--ok` dot, `ALL SYSTEMS OPERATIONAL`, hairline divider, then a live uptime counter from `profile.careerStart` reading `UPTIME 1y 7mo 06d 14:32:09`, ticking each second, tabular-nums. Implement as `lib/useUptime.ts`.
5. Two actions:
   - `VIEW WORK` — 1px `--accent` border, transparent fill, `--accent` text, 4px radius, Plex Mono 13px uppercase tracking `0.1em`. Hover: fill `--accent`, text `--ink`. Scrolls to `#architecture`.
   - `RESUME.PDF` — 1px `--hairline` border, `--fg-dim` text, same metrics. Downloads `profile.resumeUrl`. Hover: border `--fg-dim`.

**Acceptance criteria:**
- [ ] The boot sequence runs once and never repeats on re-render or scroll.
- [ ] `PIYUSH SHARMA` never wraps mid-word at any width from 320px up.
- [ ] The uptime counter's digits do not shift horizontally as they tick.
- [ ] Under reduced motion, the final state paints immediately with no typing.
- [ ] No background image, gradient, blob or particle exists in this section.

---

### T2 — System overview (section 01)

**Goal:** bio plus animated metric tiles.

**File:** `sections/Overview.tsx`

**Do:** two columns at `≥900px`, stacked below.
- Left (7/12): `Eyebrow` `01 / SYSTEM OVERVIEW`, then `profile.bio` in body style, `max-width: 62ch`.
- Right (5/12): 2×2 grid from `metrics`. Each tile: `--surface` background, 1px `--hairline` border, 4px radius, 20px padding. Value in metric style `--accent`; label beneath in eyebrow style. Hover: border → `--accent`, and `detail` reveals below the label at 12px `--fg-dim`.
- On enter, each value counts from 0 to its number over 900ms, staggered 80ms. Non-numeric characters (`%`, `+`) stay static throughout.

**Acceptance criteria:**
- [ ] Counters animate once, land on exactly `60%`, `300+`, `10+`, `3`.
- [ ] Digits never jitter (tabular-nums verified).
- [ ] `detail` text is present in the DOM for screen readers even when visually hidden.
- [ ] Reduced motion: values render final immediately.

---

### T3 — Stack (section 02)

**Goal:** a service topology, explicitly not a logo grid and not skill bars.

**File:** `sections/Stack.tsx`, `components/Chip.tsx`

**Do:** one horizontal band per entry in `stack`, stacked vertically.
- Each band: fixed 140px left column with the layer name in eyebrow style and a 1px `--hairline` vertical rule to its right; items to the right as chips (1px `--hairline` border, 4px radius, `6px 12px` padding, Plex Mono 13px, `--fg`).
- Bands separated by 1px `--hairline` rules with 28px padding above and below.
- **Signature interaction:** hovering any chip sets that chip's border and text to `--accent` and drops every other chip on the page to 35% opacity over 200ms. Hovering one thing dims the rest of the system. This behaviour is the point of the section — make sure it works across bands, not just within one.

**Acceptance criteria:**
- [ ] Hovering a chip in band 1 dims chips in band 8.
- [ ] No percentage bars, progress rings or proficiency ratings exist.
- [ ] Keyboard focus on a chip produces the same dim effect as hover.
- [ ] Below 768px chips wrap cleanly with no horizontal scroll.

---

### T4 — Deployment log (section 03)

**Goal:** experience as deployment records, headed by an animated CI/CD pipeline.

**File:** `sections/DeploymentLog.tsx`

**Do:**

**Pipeline diagram** — six nodes connected by 1px `--hairline` lines: `COMMIT → BUILD → TEST → PUSH GHCR → DEPLOY → HEALTH CHECK`. Each node is a 4px-radius box, `--surface` fill, 1px `--hairline` border, label 10px uppercase mono. On section enter, a 2px `--accent` segment travels left to right along the connecting lines over 2.4s, lighting each node's border `--accent` as it passes and leaving it `--ok` once passed. Runs once; the final node ends with an `--ok` dot.

Build this in hand-written SVG, animating `strokeDashoffset` with `motion`. **Do not** use a charting or diagram library.

**Records** — `experience`, most recent first:
- Left gutter (120px): date range in mono 12px `--fg-dim`; for `current: true`, a pill reading `ACTIVE` in `--ok` with a 1px `--ok` border.
- Main column: role in Plex Mono 500 22px `--fg`; company beneath in mono 14px `--fg-dim`; then `points` as a list, each item prefixed with a 1px `--hairline` vertical tick rather than a bullet, body style at 16px `--fg-dim`.
- Any numeral inside a point (`60%`, `300+`) is wrapped in a span coloured `--accent` with tabular-nums. Do this by matching numeric patterns at render time — never by editing the strings in `content.ts`.
- Records separated by a full-width 1px `--hairline` rule with 48px padding above and below.

**Acceptance criteria:**
- [ ] The beam animation runs exactly once per page load.
- [ ] Zero charting/diagram dependencies added.
- [ ] Point strings in the DOM match `content.ts` exactly apart from the injected numeral spans.
- [ ] No cards, panels, shadows or rounded containers — this reads as a log.
- [ ] Below 768px the pipeline scrolls horizontally within its own container rather than shrinking illegibly.

---

### T5 — Incident report (section 04) ⚑ SIGNATURE SECTION

**Goal:** the one memorable moment on the site. Give this task the most care. Content from `incident`.

**File:** `sections/Incident.tsx`

**Do:**

**Theme flip.** When this section crosses 40% of the viewport, add `theme-incident` to `<html>`; remove it on exit. Every colour token transitions over 600ms — the rail, the grid, the whole page shifts to the alert palette. Implement with a single `IntersectionObserver` at `rootMargin: "-40% 0px -40% 0px"` and a `useRef` guard so the class toggles at most once per direction. Under reduced motion, skip the page-wide flip entirely and apply the incident palette locally to this section only.

**Header.** `Eyebrow` `04 / INCIDENT REPORT`, and right-aligned a severity badge `SEV-1` in mono 11px uppercase, 1px `--crit` border, `--crit` text, 4px radius, with a slow 2s pulse on border opacity. Below: `incident.id` in mono 12px `--fg-dim`, `incident.title` in section-heading style, `incident.summary` in body style.

**Chart.** Full-width, 260px tall, hand-written SVG. X is the four-hour window, Y is unauthorised instance count. Plot `incident.curve` as a smooth path (Catmull-Rom or cardinal spline, not straight segments): 2px `--crit` stroke, `--crit` fill at 8% opacity beneath. Y gridlines 1px `--hairline` with labels in mono 10px `--fg-dim`. On enter, the path draws left to right over 2.2s via `strokeDashoffset` while the fill wipes in behind it. A dot at the peak carries the label `300+ instances` in mono 11px `--crit`.

**Timeline.** Horizontal, one node per `incident.timeline` entry. Each node: `t` above in mono 11px `--fg-dim`, an 8px dot, then `text` beneath in Plex Sans 14px with `max-width: 180px`. Dot colour by `state`: `detected`/`contained` → `--crit`, `mitigated` → `--warn`, `resolved` → `--ok`. Nodes joined by a 1px `--hairline` line. On enter, nodes illuminate in sequence 400ms apart with the joining line filling in the colour of the node just reached. When the final node resolves, the `SEV-1` badge crossfades to `RESOLVED` in `--ok`.

**Impact strip.** The four `incident.impact` figures — value in metric style, label beneath in eyebrow style, separated by 1px `--hairline` vertical rules.

**Follow-up.** `incident.followUp` in a block with a 2px `--ok` left border, 20px left padding, Plex Sans 16px `--fg-dim`, preceded by an eyebrow `FOLLOW-UP ACTIONS`.

**Acceptance criteria:**
- [ ] Scrolling in and out repeatedly never leaves `theme-incident` stuck on, and never flickers at the boundary.
- [ ] The chart is a hand-written SVG path. Zero charting dependencies.
- [ ] The chart curve is smooth, not polylinear.
- [ ] The badge reaches `RESOLVED` only after the final timeline node illuminates.
- [ ] Under reduced motion: no page-wide flip, no path draw, section renders resolved and complete.
- [ ] Below 768px the timeline becomes vertical and the chart stays legible.
- [ ] Fallback rule: if the page-wide flip cannot be made stable after two attempts, scope the palette to this section only, record it in `DECISIONS.md`, and move on. The section still lands without the page-wide effect.

---

### T6 — Architecture (section 05)

**Goal:** projects as system diagrams, not project cards.

**File:** `sections/Architecture.tsx`

**Do:** for each entry in `projects`, a full-width block in two parts. **Alternate the left/right order between the two projects** so the page doesn't read as a repeating template.

- Text side (5/12): `name` in Plex Mono 500 28px; `tagline` beneath in mono 14px `--fg-dim`; `role` in eyebrow style; `points` as a hairline-tick list matching T4; `tags` as chips matching T3. If `url` is non-empty, a link at the bottom showing the bare hostname in `--accent` with a small arrow.
- Diagram side (7/12): SVG built from `diagram.nodes` and `diagram.edges`. Each node is a 4px-radius box, `--surface` fill, 1px `--hairline` border, label 11px mono `--fg`. Vistofy lays out as a branching topology (Cloudflare at top → load balancer → frontend and backend → Redis and AI service, with Loki collecting from all three); the CI/CD project is a straight left-to-right chain.
- **Node hover:** node border and label → `--accent`, its connected edges → `--accent`, unconnected nodes → 35% opacity. A tooltip in mono 11px shows that node's `host` string.
- On enter, the diagram draws itself: edges animate in over 1.2s, then nodes fade in staggered 60ms.

**Acceptance criteria:**
- [ ] Edges are derived from the `edges` array, not hardcoded coordinates in the component.
- [ ] Hovering `Backend API` highlights exactly its four edges and no others.
- [ ] The two projects use opposite column orders.
- [ ] Below 768px the diagram stacks below the text and scales to fit without a scrollbar.

---

### T7 — Endpoints, footer (section 06)

**File:** `sections/Endpoints.tsx`

**Do:**
- `Eyebrow` `06 / ENDPOINTS`, then a section heading reading `OPEN TO WORK`. Do not write "Let's work together" or "Get in touch".
- Contact rows styled as a config table: 1px `--hairline` bottom border per row, key on the left in eyebrow style (`EMAIL` / `LINKEDIN` / `GITHUB` / `RESUME` / `LOCATION`), value on the right in Plex Mono 15px `--fg`. Email, LinkedIn, GitHub and Resume are links; hover turns the value `--accent` and slides in a small arrow. Location is static: `Jaipur, Rajasthan, India · IST (UTC+5:30)`.
- If `profile.linkedin` or `profile.github` is empty, omit that row entirely rather than rendering a dead link.
- **No contact form.**
- Footer: `education` as two compact rows — degree in mono 14px `--fg`, school and year in 12px `--fg-dim`, `note` right-aligned in mono `--fg-dim`. Below, a status line in mono 11px uppercase tracking `0.14em`: pulsing `--ok` dot, `ALL SYSTEMS OPERATIONAL`, hairline divider, live uptime, hairline divider, `BUILT AND DEPLOYED BY PIYUSH SHARMA`.

**Acceptance criteria:**
- [ ] Zero `<form>` elements exist in the codebase.
- [ ] Empty profile URLs produce no rendered row and no console error.
- [ ] The footer uptime and the hero uptime read identical values at the same moment.

---

### T8 — Command palette and terminal

**Files:** `components/CommandPalette.tsx`, `components/Terminal.tsx`

**Command palette.** `Cmd+K` / `Ctrl+K` opens a centred panel, 560px wide, `--surface` background, 1px `--hairline` border, 4px radius, mono text input at top, filtered list beneath. Each result: mono label left, category tag right in `--fg-dim`. Arrow keys navigate, Enter runs, Escape closes; the highlighted row carries a 2px `--accent` left border. Focus is trapped while open and restored on close.

Commands:
```
goto hero | overview | stack | experience | incident | projects | contact   → smooth scroll
open resume        → download profile.resumeUrl
open linkedin      → open profile.linkedin (hidden if empty)
open github        → open profile.github (hidden if empty)
copy email         → copy profile.email, toast "copied" in --ok
toggle motion      → toggle a manual reduced-motion override
```

A persistent hint sits bottom-right: a `⌘K` keycap in mono 11px with a 1px `--hairline` border. Hidden on touch devices (`(hover: none)`).

**Terminal.** Pressing `~` outside an input slides a panel up from the bottom, 320px tall, `--surface` background, 1px `--hairline` top border, monospace, prompt `piyush@control-plane:~$`. Buffer is a string array.

```
help              list commands
whoami            piyush sharma — devops engineer, jaipur, in
ls                overview  stack  experience  incident.log  projects  contact
cat incident.log  the incident timeline as log lines with coloured severity tags
uptime            the live career uptime string
skills            the stack grouped by layer
clear             clear buffer
exit              close
```
Unknown input prints `command not found: <input>. try 'help'`. Escape also closes.

**Acceptance criteria:**
- [ ] `Cmd+K` does not fire while the terminal input is focused, and `~` does not fire while any input is focused.
- [ ] Every palette command works, including on a fresh page load with no prior scroll.
- [ ] Palette is fully keyboard-operable with a visible focus ring; focus returns to the trigger on close.
- [ ] Terminal output is derived from `content.ts`, not duplicated strings.
- [ ] The `⌘K` hint is absent on touch devices.
- [ ] Cut scope rule: if the terminal fights the implementation, drop it and note it in `DECISIONS.md`. The palette matters more.

---

### T9 — QA, accessibility, performance, meta

**Goal:** no new features. Harden what exists.

**Responsive.** Verify 375 / 768 / 1024 / 1440 / 1920. No horizontal overflow at any width. Below 1024px the rail is a top bar. Below 768px: metric tiles single-column, incident timeline vertical, diagrams stacked, terminal 60vh, `⌘K` hint hidden.

**Accessibility.**
- Every interactive element keyboard-reachable with a visible `--accent` focus ring.
- Exactly one `<h1>`; section headings are sequential `<h2>`.
- Every SVG either has a `<title>` or `aria-hidden="true"`.
- `--fg-dim` on `--surface` passes 4.5:1. If it doesn't, raise the lightness of `--fg-dim` and update §3.1.
- Reduced motion genuinely disables the theme flip, chart draw, counters, pipeline beam and all scroll reveals.
- Semantic landmarks: `<nav>` for the rail, `<main>`, `<footer>`.

**Performance.**
- Preload both fonts, `font-display: swap`, no FOUT flash.
- Lazy-mount the incident chart, project diagrams and terminal — they must not run before needed.
- Target Lighthouse ≥95 on performance and accessibility.

**Meta.**
```
title:       Piyush Sharma — DevOps Engineer
description: DevOps engineer in Jaipur. Multi-cloud infrastructure, CI/CD, Kubernetes
             and observability. Cut cloud spend 60% and recovered a compromised AWS
             account in four hours.
```
Add Open Graph and Twitter card tags pointing at `/og.png`, and a JSON-LD `Person` schema with name, jobTitle, address, email and `sameAs` for LinkedIn and GitHub. Favicon: the letter `P` in IBM Plex Mono on `--ink`.

**Content audit.** Walk every rendered string in the app and confirm it originates in `src/data/content.ts`. Delete any invented company, metric, date, job title, project detail, testimonial or certification. Do not paraphrase the bullet points.

**Acceptance criteria:**
- [ ] Lighthouse performance ≥95 and accessibility ≥95 on the production build.
- [ ] Full keyboard traversal of the page reaches every interactive element in a sensible order.
- [ ] With OS reduced-motion enabled, no animation runs and no content is missing.
- [ ] No string renders that is absent from `content.ts`.
- [ ] `npm run build` clean; no console warnings or errors in the preview build.

---

## §6 — Deploy

Cloudflare Pages is the recommended target — it fits the subject's existing Cloudflare experience, and "deployed on Cloudflare Pages behind my own pipeline" is a stronger line in an interview than any no-code alternative.

```
Build command:      npm run build
Build output:       dist
Node version:       22
```

Optionally add `.github/workflows/deploy.yml` running lint and build on push to `main` — on this particular site, a visible CI pipeline is part of the portfolio.

---

## §7 — Human checklist before going live

- [ ] `linkedin` and `github` filled in `content.ts`
- [ ] `Piyush_Sharma_Resume_DevOps.pdf` present in `public/`
- [ ] `og.png` created at 1200×630 (a hero screenshot works)
- [ ] Domain purchased and pointed — `piyush.sh` or `piyushsharma.dev`
- [ ] Tested on a real phone, not just the browser device emulator
- [ ] Tabbed through the whole page with the keyboard
- [ ] Reloaded with OS reduced-motion on and confirmed nothing breaks
- [ ] Lighthouse run against the deployed URL, not localhost
- [ ] URL added to LinkedIn headline and resume header
- [ ] Calendar reminder set six months out to refresh the metrics — that's the only maintenance this site needs
