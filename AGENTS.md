# AGENTS.md — Wedding Invitation Website

## Project Overview

This is a **single-page wedding invitation website** for Pavel & Olga (Павел и Ольга), wedding date 08.07.2026. The site is written entirely in **Russian** and features elegant scroll-triggered animations, a custom particle background, and an RSVP form. It is a purely static frontend application built with React 19 and deployed to GitHub Pages.

## Technology Stack

- **Framework**: React 19 (with StrictMode)
- **Language**: TypeScript 5.9 (strict mode enabled)
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.19 + custom CSS variables
- **UI Components**: shadcn/ui (New York style, 40+ components pre-installed)
- **Animation**: GSAP 3.15 + ScrollTrigger, Lenis smooth scrolling
- **Routing**: react-router 7 (BrowserRouter configured, though the app is single-page)
- **Icons**: Lucide React
- **Fonts**: Google Fonts — Cormorant Garamond, Great Vibes, Inter

## Project Structure

```
src/
  App.tsx                 # Root component; sets up Lenis smooth scroll and renders all sections
  main.tsx                # Entry point; mounts React with StrictMode + BrowserRouter
  index.css               # Global styles, Tailwind directives, CSS custom properties, custom component classes
  App.css                 # Additional app-specific styles (mostly unused)
  config.ts               # Wedding configuration: couple names, date, venue, RSVP endpoint
  sections/               # Page section components (each is a default export)
    HeroSection.tsx         # Hero with couple photo, names, tagline, date, scroll indicator
    DetailsSection.tsx      # Wedding details: date/time, venue, map link
    RSVPSection.tsx         # RSVP form with attendance, dietary restrictions, message
    TimelineSection.tsx     # Countdown timer + wedding day timeline
    FooterSection.tsx       # Closing note, names, date
    ParticleCanvas.tsx      # Fixed HTML5 Canvas warm-glow particle background
  components/ui/          # shadcn/ui components (button, card, dialog, form, etc. — 40+ files)
  hooks/
    use-mobile.ts           # useIsMobile hook (768px breakpoint)
  lib/
    utils.ts                # cn() utility: merges clsx + tailwind-merge
  pages/
    Home.tsx                # Single page component (currently minimal)
  types/                    # Type definitions directory (empty as of now)
public/
  images/
    couple-hero.jpg         # Couple photo used in HeroSection
  assets/textures/
    paper-texture.jpg       # Subtle paper grain overlay texture
```

## Build and Development Commands

All commands use `npm`:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Run TypeScript compiler + Vite production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the entire project |

There are **no test commands** — the project does not include a test framework.

## Key Configuration Files

- `vite.config.ts` — Vite config with `@/` alias to `./src`, dev server port 3000, `base: './'` for relative asset paths (required for GitHub Pages).
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — Standard Vite+React TS project references setup. Strict linting flags enabled (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`).
- `tailwind.config.js` — Custom theme colors (warm ivory, antique gold, sepia tones), custom fonts (display/script/body), border radius, keyframes.
- `components.json` — shadcn/ui configuration: New York style, CSS variables, `@/components` alias.
- `postcss.config.js` — TailwindCSS + autoprefixer.
- `eslint.config.js` — Flat config: `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`. Ignores `dist/`.

## Deployment

The project is automatically deployed to **GitHub Pages** via `.github/workflows/deploy.yml`:

- Triggers on every push to `main` or manual `workflow_dispatch`.
- Uses Node.js 20, runs `npm install` + `npm run build`, uploads `./dist` as a Pages artifact.

**Important**: `vite.config.ts` sets `base: './'` so that assets load correctly from relative URLs on GitHub Pages.

## Code Style Guidelines

- **TypeScript**: Strict mode. All components are typed. Unused locals/parameters are compiler errors.
- **Imports**: Use `@/` path alias for `src/` imports (e.g., `@/lib/utils`, `@/components/ui/button`).
- **Components**: 
  - Section components in `src/sections/` use **default exports**.
  - shadcn/ui components use named exports and follow the standard shadcn pattern with `cn()` + `cva` for variant styling.
- **Styling**: 
  - Tailwind utility classes are primary.
  - Custom reusable classes (e.g., `.section-padding`, `.content-max-width`, `.divider-line`) are defined in `src/index.css` inside `@layer components`.
  - Custom color tokens are defined in both `tailwind.config.js` and as CSS variables in `index.css`.
- **Animations**: 
  - GSAP + `IntersectionObserver` are used for scroll-triggered entrance animations.
  - `prefers-reduced-motion` is respected globally in `index.css` (animations/transitions reduced to 0.01ms).
- **Comments**: Mixed Russian and English. Config file comments are in Russian.

## Content Configuration

All wedding-specific content lives in `src/config.ts`:

```ts
export const config = {
  couple: { namesFull, namesShort, namesFormal },
  wedding: { date, time, venue, location, mapLink },
  rsvp: { endpoint, deadline },
};
```

**Critical**: `config.rsvp.endpoint` is currently an empty string. To make the RSVP form functional, set it to a Google Apps Script URL, Formspree endpoint, or similar. When empty, the form shows a help message instead of submitting.

## Security Considerations

- The RSVP form submits via `fetch()` with `mode: 'no-cors'`. This means the response cannot be read, and success is assumed on no-throw.
- No authentication or sensitive data handling is present.
- The site is a static SPA with no backend API beyond the optional RSVP form endpoint.

## Adding New Sections

1. Create a new file in `src/sections/MySection.tsx`.
2. Export a default functional component.
3. Import and add it to `src/App.tsx` inside the `<main>` element.
4. Use `useRef` + `IntersectionObserver` + GSAP for scroll animations, following the pattern in existing sections.
5. Reuse Tailwind custom classes like `section-padding`, `content-max-width`, `divider-line` for consistent spacing.

## Notes for AI Agents

- The entire UI is in **Russian**. When editing text or adding new copy, use Russian.
- The project uses **React 19** — there are no class components; everything is functional with hooks.
- Do not change `base: './'` in `vite.config.ts` unless you also update the GitHub Pages deployment strategy.
- Do not add a test framework unless explicitly requested; the project currently has none.
- The `src/pages/Home.tsx` exists but is not actively used in routing (the app renders sections directly from `App.tsx`).
