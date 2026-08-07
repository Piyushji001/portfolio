# AGENTS.md — piyush.sh portfolio

## Read this first

**`docs/PORTFOLIO_SPEC.md` is the authoritative specification for this project.** Read it in full before writing any code. It contains the design system, the content data, and ten build tasks (T0–T9) with acceptance criteria. This file exists only to carry the hard rules; the spec carries the detail.

If this file and the spec disagree, the spec wins. If the spec is silent, apply its §1.4 defaults and log the decision in `DECISIONS.md`. Do not stop to ask.

## What this is

A single-page personal portfolio for a DevOps engineer, built around one concept: **the site presents itself as an infrastructure control plane.** Structure, language and visual state borrow from status pages, Grafana and incident postmortems. Restrained and precise throughout, with exactly one bold moment (the incident section, task T5).

## Stack

```
React 19 · TypeScript · Vite · Tailwind CSS v4 (@tailwindcss/vite) · motion (Framer Motion)
```

No router. No backend. No database. No auth. No CMS. No UI kit. No icon package. No charting library.

## Commands

```
npm run dev        local dev server
npm run build      production build — must pass after every task
npm run preview    serve the production build
```

## Hard rules

1. **All user-facing content comes from `src/data/content.ts`.** Never hardcode a name, metric, date, company, bullet point or project detail into a component. If a string is needed that isn't in the content file, add it there first.
2. **Never invent facts.** Every number, employer, date and technology in the content file is real and belongs to a real person. Do not embellish, round, rephrase, add bullets, or "improve" a claim. Do not add projects, skills, certifications or testimonials that aren't in the spec.
3. **Never hardcode a colour.** Every colour is a CSS custom property defined in `src/index.css` per spec §3.1. No hex literals in components.
4. **One easing curve site-wide:** `cubic-bezier(0.16, 1, 0.3, 1)`.
5. **`prefers-reduced-motion` must genuinely work** — every transform, counter, path-draw and theme transition disabled, all content rendered in its final state.
6. **No new dependencies** beyond the stack above. If one seems unavoidable, record the reason in `DECISIONS.md` before adding it.
7. **Run `npm run build` after every task.** A task is not done if the build fails or emits TypeScript errors.
8. **Work one task at a time.** After each task, verify against its acceptance criteria, run the build, and stop for review before starting the next.

## Deny list

Never produce any of these — they are the defaults an AI drifts toward and all of them are wrong for this project:

- purple or blue gradient backgrounds
- glassmorphism, `backdrop-blur`, particle fields, neon glow on text
- animated gradient borders, decorative 3D tilt cards, box shadows of any kind
- `rounded-lg` / `rounded-xl` / `rounded-2xl` — **max radius is 4px**
- emoji anywhere in the UI
- centred hero or centred section headers — **everything is left-aligned**
- skill percentage bars, proficiency ratings, logo-soup skill grids
- stock photos, illustrations, AI-generated imagery
- copy reading "Hi, I'm…", "Let's work together", "Get in touch"
- rotating typewriter job titles
- `<form>` elements

## Design tokens (reference — full spec in §3.1)

```
--ink       #0E1116   page canvas (blue-slate, deliberately not black)
--surface   #151A21
--hairline  #262E38
--fg        #E7E4DD   warm bone
--fg-dim    #8A94A0
--accent    #F2A93B   signal amber
--ok        #46B98A   healthy status ONLY — never decorative
--crit      #E0555A
```

Display face is **IBM Plex Mono**, used at headline sizes. This is deliberate — do not substitute Inter, Geist or Space Grotesk for headings. Body is IBM Plex Sans. Every animated numeral needs `font-variant-numeric: tabular-nums`.

## Copy tone

Terse and technical, in the register of a status page. Sentence case in prose; UPPERCASE only for eyebrows, labels and buttons. No exclamation marks. No first-person marketing voice — the bio is the only place "I" appears.

## Build order

```
T0  Foundation — tokens, fonts, rail, grid overlay, content.ts, empty sections
T1  Hero (00)
T2  System overview (01)
T3  Stack (02)
T4  Deployment log (03)
T5  Incident report (04)  ← signature section, give it the most care
T6  Architecture (05)
T7  Endpoints + footer (06)
T8  Command palette + terminal
T9  QA, accessibility, performance, meta
```

Full task definitions and acceptance criteria: `docs/PORTFOLIO_SPEC.md` §5.

## Gotchas

- Tailwind v4 has no `tailwind.config.js` by default. Tokens go in `index.css` via `@theme inline` bridging to runtime CSS custom properties — the theme must stay swappable at runtime for T5.
- `motion` is the current package name for Framer Motion. Import from `"motion/react"`.
- The T5 theme flip is the most likely thing to break. Use a single `IntersectionObserver` with `rootMargin: "-40% 0px -40% 0px"` and a `useRef` guard. If it can't be made stable in two attempts, scope the palette to the section only, log it in `DECISIONS.md`, and move on.
- Charts and diagrams are hand-written SVG animated via `strokeDashoffset`. Reaching for Recharts is a spec violation.
