# DECISIONS.md — Decisions Log

- Spacing: Multiples of 4px. Section vertical padding set to 96px (24 in tailwind).
- Max corner radius: 4px across all components (`rounded-sm` or `4px` inline).
- Motion easing: Single easing curve site-wide `cubic-bezier(0.16, 1, 0.3, 1)`.
- Reduced motion: Fully supported via CSS media query `@media (prefers-reduced-motion: reduce)` and `framer-motion` `useReducedMotion()`.
- Theme flip: Managed via single `IntersectionObserver` with `-40% 0px -40% 0px` root margin to prevent re-trigger flicker.
- Deployment target: Configured for static SPA deployment compatible with Vercel, Cloudflare Pages, Netlify.
- Package manager & Turbo build: User requested pnpm and turbo pipeline support (`pnpm-lock.yaml` & `turbo.json`).
