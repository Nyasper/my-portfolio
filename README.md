# Portfolio

Personal portfolio built with [SvelteKit](https://svelte.dev/docs/kit) and Svelte 5 (runes). Single-page layout with hero, about, skills, filterable projects, FAQ and contact sections.

- **Styling:** vanilla CSS with custom properties (glassmorphism), dark/light themes
- **i18n:** [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) — English (default) and Spanish
- **Package manager:** [Bun](https://bun.sh)
- **Analytics:** Vercel Analytics

## Setup

```sh
bun install
cp .env.example .env # fill in your public profile values
```

## Developing

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

```sh
bun run build
bun run preview
```

## Quality checks

```sh
bun run check  # svelte-check (types + a11y)
bun run lint   # prettier --check + eslint
bun run format # prettier --write
```

## Project structure

- `src/lib/components/` — one component per section (`{Name}Section.svelte`) plus shared primitives
- `src/lib/data/` — `projects.json`, `techstacks.json` (content + brand colors + SVG icons)
- `src/lib/messages/` — i18n messages (`en.json`, `es.json`), keys in flat snake_case
- `src/app.css` — global styles and CSS custom properties (theme tokens)

See `AGENTS.md` for full project conventions.
