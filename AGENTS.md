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

## Data Structure

### `src/lib/data/projects.json`
| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier |
| `name` | `string` | Display name |
| `slug` | `string` | URL-friendly identifier for routing |
| `shortDescription` | `string` | ~80 char summary for cards |
| `longDescription` | `string` | Full description for detail view |
| `images` | `string[]` | Gallery screenshot URLs (local paths in `static/`) |
| `techstack` | `number[]` | References to `techstacks.json` `id`s |
| `github` | `string` | Repository URL |
| `deploy` | `string` | Live deployment URL |
| `status` | `"active" \| "inactive" \| "archived"` | Deployment status |
| `date` | `string` | `"YYYY-MM"` format for chronological sorting |
| `highlights` | `string[]` | Key feature bullet points |

### `src/lib/data/projects-internal.json`
Internal reference file for personal notes. **Not used in the UI.**

| Property | Type | Description |
|---|---|---|
| `id` | `number` | Matches `projects.json` `id` |
| `difficulty` | `"easy" \| "normal" \| "complex"` | Complexity level |
| `difficultyReason` | `string` | Explanation of why it ranks at that level |

### `src/lib/data/techstacks.json`
| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier |
| `name` | `string` | Display name |
| `category` | `"language" \| "framework" \| "library" \| "database" \| "tool" \| "platform"` | Technology type |
| `color` | `string` | Brand hex color for badge/pill styling |
| `icon` | `string` | SVG path or icon identifier |
| `url` | `string` | Official website URL |

### Techstack Reference

| ID | Name | Category |
|---|---|---|
| 1 | JavaScript | language |
| 2 | TypeScript | language |
| 3 | Node.js | platform |
| 4 | Bun | platform |
| 5 | Svelte | framework |
| 6 | SvelteKit | framework |
| 7 | React | framework |
| 8 | Next.js | framework |
| 9 | Vue.js | framework |
| 10 | Angular | framework |
| 11 | Tailwind CSS | library |
| 12 | Express | framework |
| 13 | Hono | framework |
| 14 | Better Auth | library |
| 15 | Drizzle ORM | library |
| 16 | C# | language |
| 17 | .NET | platform |
| 18 | ASP.NET | framework |
| 19 | Entity Framework | library |
| 20 | PostgreSQL | database |
| 21 | Docker | tool |

### Projects → Techstack Map

| ID | Project | Tech IDs | Tech Names |
|---|---|---|---|
| 1 | Draw App | `[2,4,5,6,7,14,15,20,21]` | TS, Bun, Svelte, SvelteKit, React, Better Auth, Drizzle, PostgreSQL, Docker |
| 2 | Anime Database | `[2,7,8,11]` | TS, React, Next.js, Tailwind CSS |
| 3 | Netflix Clone | `[2,5,6]` | TS, Svelte, SvelteKit |
| 4 | CSS Animations Gallery | `[2,5,6]` | TS, Svelte, SvelteKit |
| 5 | Blue Archive Database | `[2,7]` | TS, React |
| 6 | Vue Notes App | `[2,9,13]` | TS, Vue.js, Hono |
| 7 | Hono Notes Backend | `[2,4,13,15]` | TS, Bun, Hono, Drizzle |
| 8 | Wiki Scraper | `[16,17,19]` | C#, .NET, Entity Framework |
| 9 | Simple Anime Gallery | `[1]` | JS |
| 10 | Angular Marvel API | `[2,10]` | TS, Angular |
| 11 | NoteNow | `[2,4,5,6,14,15,20,21]` | TS, Bun, Svelte, SvelteKit, Better Auth, Drizzle, PostgreSQL, Docker |
