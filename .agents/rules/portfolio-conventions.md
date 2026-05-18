# Portfolio Project Conventions

## Stack & Tooling
- **Framework:** SvelteKit with **Svelte 5** exclusively (never Svelte 4 patterns)
- **Package Manager:** `bun` — always use `bun install`, `bun run dev`, `bunx` etc.
- **Styling:** Vanilla CSS only (no Tailwind). All theming via CSS custom properties in `src/app.css`
- **i18n:** Paraglide (installed via `bunx sv add paraglide`). Messages live in `messages/en.json` and `messages/es.json`
- **Default Language:** English (`en`). Spanish (`es`) as secondary
- **Default Theme:** Dark mode. Light mode available via user toggle

## Svelte 5 Runes — Mandatory
All reactive state MUST use Svelte 5 runes. **Never** use Svelte 4 reactive patterns:

```svelte
<!-- ✅ CORRECT: Svelte 5 -->
let count = $state(0);
let doubled = $derived(count * 2);
let { name, age } = $props();

$effect(() => {
  console.log(count);
});

<!-- ❌ WRONG: Svelte 4 — never use these -->
let count = 0;           // not reactive
$: doubled = count * 2;  // deprecated
export let name;          // deprecated
```

## Paraglide i18n Usage
- Import messages: `import * as m from '$lib/paraglide/messages';`
- Use in templates: `{m.message_key()}`
- Import runtime: `import { getLocale, localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';`
- Message keys use **underscores** (flat structure), e.g. `nav_home`, `hero_greeting`
- When switching locale, use `deLocalizeHref()` + `localizeHref()` pattern with `<a>` tags (never `goto()` for locale switching — the server middleware needs full navigation)

## Design System
- **Glassmorphism / Mica effect:** Use the `.glass-panel` utility class for any card, panel, or overlay
- **CSS Variables:** All colors, backgrounds, borders, and shadows use `var(--*)` tokens defined in `app.css`
- **Theming:** Light/dark controlled via `[data-theme='light']` selector on `<html>`
- **Typography:** Google Fonts "Outfit" (weights 300–700)
- **Border radius:** Panels use `16px`, pills/buttons use `30px–50px`
- **Navbar:** Always a floating pill (`border-radius: 50px`, `position: fixed`, centered via `left: 50%; transform: translateX(-50%)`)

## Accessibility
- Respect `prefers-reduced-motion: reduce` — global rule in `app.css` disables all animations/transitions
- Limit simultaneous on-screen animations to avoid visual overload
- All interactive elements must have `aria-label` attributes
- Keyboard navigable

## Project Architecture
- Components: `src/lib/components/`
- Global styles: `src/app.css`
- Paraglide messages: `messages/{en,es}.json`
- Paraglide generated: `src/lib/paraglide/` (auto-generated, do not edit)
- Routes: `src/routes/`
- Server hooks: `src/hooks.server.ts` (Paraglide middleware)
- Client hooks: `src/hooks.ts` (Paraglide reroute)

## Key Features to Implement
- **Skills → Projects filtering:** Clicking a technology pill in the Skills section filters the Projects grid to show only matching projects
- **Project status:** Each project has `active` | `inactive` state. Active projects display their deployment URL
- **Scroll animations:** Fade-in-up on scroll entry, with a cap on simultaneous visible animations
