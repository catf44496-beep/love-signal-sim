# CLAUDE.md

## Project Overview

**love-signal-sim** (心动信号 - Love Signal) is an interactive dating simulation web game built as a Progressive Web App. Players take the role of an observer/guest (苏若 - Su Ruo) interacting with three male characters in a reality dating show villa format. Features branching narrative, character relationship tracking, social media simulation, and multiple endings.

Primary language of game content is Simplified Chinese.

## Tech Stack

- **Framework:** React 19.2 with TypeScript ~5.9 (strict mode)
- **Build:** Vite (via rolldown-vite) with @vitejs/plugin-react
- **Styling:** Tailwind CSS 4.1 + PostCSS + custom CSS
- **Icons:** lucide-react
- **Module system:** ESM (`"type": "module"`)
- **Target:** ES2022 (app), ES2023 (node/build tooling)

## Commands

```bash
npm run dev       # Start dev server (Vite HMR, default port 5173)
npm run build     # TypeScript type-check (tsc -b) then Vite production build
npm run lint      # Run ESLint (flat config, v9+)
npm run preview   # Preview production build locally
```

There is no test framework configured. No test runner or test files exist.

## Project Structure

```
src/
  App.tsx        # Main application (~3800 lines) - all components, types, game data, and logic
  main.tsx       # React entry point (StrictMode, CSS imports)
  index.css      # Tailwind CSS import
  App.css        # Layout styles, animations, responsive overrides
  mobile.css     # Mobile-specific optimizations (touch, safe areas, viewport)
  assets/        # Static assets (SVGs)
public/
  manifest.json  # PWA manifest
  images/        # Game image assets
```

The entire application lives in a single file (`App.tsx`). It contains:
1. Imports
2. TypeScript interfaces (~15 types)
3. Data constants (PROTAGONIST, CHARACTERS, SCENARIOS, ENDINGS, etc.)
4. Utility/decoration components (GlassBackground, HeartBloom, etc.)
5. Feature components (~30 components for story, chat, social, diary, etc.)
6. Main App export
7. Inline style blocks

## Code Conventions

### Naming
- **Components:** PascalCase (`ChatDetailView`, `InstagramProfileView`)
- **Variables/functions:** camelCase (`activeTab`, `handleTabChange`)
- **Constants:** UPPER_SNAKE_CASE (`PROTAGONIST`, `CHARACTERS`, `SCENARIOS`)
- **Types/Interfaces:** PascalCase (`Character`, `CharacterStats`, `StoryScenario`)

### TypeScript
- Strict mode enabled; `noFallthroughCasesInSwitch: true`
- `noUnusedLocals` and `noUnusedParameters` are both **false** (relaxed)
- String literal union types for enums: `'text' | 'image' | 'voice'`, `'SSR' | 'SR' | 'R'`
- Functional components typed inline: `({ data }: { data: Type }) => ...`

### React Patterns
- All functional components using hooks (`useState`, `useEffect`, `useRef`, `useMemo`)
- No external state management library — all state via `useState`
- Conditional rendering with `&&` and ternary operators
- List rendering with `.map()`

### Styling
- Tailwind CSS utility classes as primary styling method
- Custom CSS for animations (`@keyframes`) and complex responsive layouts
- Mobile-first responsive design with `@media (max-width: 768px)`
- Inline `<style>` blocks within components for component-scoped animations

### Game Data
- Characters, scenarios, endings, and social data defined as typed constants
- 9-episode branching narrative (ep1-ep9)
- 3 playable character routes (Lu Xingci, Shen Yu, Jiang Zhe)
- Character stats: `heartbeat`, `jealousy`, `syncRate`, `mood`, `trait`, `cpRate`

## Linting

ESLint 9 flat config (`eslint.config.js`):
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `react-hooks` recommended (enforces Rules of Hooks)
- `react-refresh` for Vite Fast Refresh compatibility
- Ignores `dist/` directory

No Prettier or other formatter is configured.

## Mobile / PWA

- PWA manifest at `public/manifest.json` with standalone display, portrait orientation
- Theme color: `#120024` (dark purple)
- `mobile.css` includes: safe area insets, 100dvh viewport fix, 44x44px min touch targets, scroll performance, tap highlight removal
- `index.html` sets `viewport-fit=cover`, disables user scaling, and includes Apple mobile web app meta tags

## Key Architectural Notes

- The entire app is a single-file architecture in `App.tsx`. When making changes, be aware of the file size and locate the relevant component/section before editing.
- No routing library — navigation is handled via state (`activeTab`, view state variables).
- No external API calls — all game data is embedded as constants.
- Production dependencies are minimal: `react`, `react-dom`, `lucide-react`.
