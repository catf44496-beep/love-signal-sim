# CLAUDE.md

## Project Overview

**love-signal-sim** (心动信号 - Love Signal) is an interactive dating simulation web game built as a Progressive Web App. Players take the role of an observer/guest (苏若 - Su Ruo) interacting with three male characters in a reality dating show villa format. Features branching narrative, character relationship tracking, social media simulation (WeChat-style chat, Weibo-style feeds), and multiple endings.

Primary language of game content is Simplified Chinese.

## Tech Stack

- **Framework:** React 19.2 with TypeScript ~5.9 (strict mode)
- **Build:** Vite (via `rolldown-vite@7.2.5`) with `@vitejs/plugin-react`
- **Styling:** Tailwind CSS 4.1 + PostCSS (`@tailwindcss/postcss`) + custom CSS
- **Icons:** lucide-react (55+ icons imported)
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
  index.css      # Tailwind CSS import (single line: @import "tailwindcss")
  App.css        # Layout styles, animations, responsive overrides
  mobile.css     # Mobile-specific optimizations (222 lines: touch, safe areas, viewport)
  assets/        # Static assets (react.svg)
public/
  manifest.json  # PWA manifest
  vite.svg       # Favicon
  images/        # Game image assets (episode1.png, kaipian.gif, character images)
```

Root-level files also include: `git-setup-guide.md`, `移动端部署指南.md` (mobile deployment guide), and PowerShell helper scripts (`pack-project.ps1`, `quick-git-upload.ps1`, `setup-git.ps1`).

## App.tsx Internal Structure

The entire application lives in a single file (`App.tsx`, ~3800 lines). It is organized in this order:

| Section | Lines (approx) | Contents |
|---|---|---|
| Imports | 1–60 | lucide-react icons, React hooks |
| Type Definitions | 62–270 | 21 interfaces (see below) |
| Data Constants | 274–740 | PROTAGONIST, CHARACTERS, SCENARIOS, ENDINGS, etc. |
| Utility Components | 743–780 | GlassBackground, HeartBloom |
| Feature Components | 784–2520 | ~26 components for story, chat, social, diary, etc. |
| Main App Component | 2522–3700 | `LoveSignalSim` — exported default, all app state and navigation |
| Inline Styles | 3700–3802 | `<style>` block with CSS animations |

### Key Interfaces (21 total)

`CharacterStats`, `CharacterProfile`, `DiaryEntry`, `DateScenario`, `EndingScenario`, `Character`, `ChatMessage`, `ChatContact`, `WeiboPost`, `CPItem`, `HotSearchItem`, `Dialogue`, `StoryOption`, `StoryScenario`, `ProtagonistStat`, `CalendarEvent`, `ObserverPost`, `FanDiscussion`, `EpisodeSocialData`, `PostEpisodeMessage`, `SocialPost`

### Data Constants

| Constant | Type | Description |
|---|---|---|
| `PROTAGONIST` | object | Player character (苏若) stats, tags, avatar |
| `CHARACTERS` | `Character[]` | 3 male leads: 陆星辞 (Lu Xingci), 沈昱 (Shen Yu), 姜哲 (Jiang Zhe) |
| `SCENARIOS` | `StoryScenario[]` | 9 episodes (ep1–ep9) with branching story options |
| `ENDINGS` | `EndingScenario[]` | Multiple endings per character (True/Normal/Bad End) |
| `CALENDAR_EVENTS` | `CalendarEvent[]` | Timeline events for each episode |
| `DIARIES` | `DiaryEntry[]` | Character diary entries (unlockable) |
| `DATES` | `DateScenario[]` | Date scenario content |
| `INITIAL_CHATS` | `ChatContact[]` | Initial chat/messaging data |
| `EPISODE_SOCIAL_DATA` | `Record<string, EpisodeSocialData>` | Weibo-style social media per episode (hot searches, CP rankings) |
| `EPISODE_MESSAGES` | `Record<string, PostEpisodeMessage[]>` | Post-episode character messages |

### Components (~28)

**Story/Narrative:** `EpisodeOpening`, `InvitationCard`, `WelcomeText`, `FullScreenStoryView`, `EpisodeDetailModal`, `StoryOverlay`, `StoryDecisionOverlay`, `NextStorySelector`, `PlayerIntroDialogue`, `DecisionCardSelector`

**Social/Community:** `ObserverPostItem`, `FanDiscussionItem`, `ObservationRoomModal`, `WeiboDetailView`, `InstagramProfileView`

**Character/Profile:** `MaleLeadStatusCard`, `ChatDetailView`, `DiaryReader`, `DateSelector`, `EndingSelector`

**UI/Decoration:** `GlassBackground`, `HeartBloom`, `CalendarView`

**Main:** `LoveSignalSim` (default export — contains all app state, tab navigation, and rendering logic)

## Code Conventions

### Naming
- **Components:** PascalCase (`ChatDetailView`, `InstagramProfileView`)
- **Variables/functions:** camelCase (`activeTab`, `handleTabChange`)
- **Constants:** UPPER_SNAKE_CASE (`PROTAGONIST`, `CHARACTERS`, `SCENARIOS`)
- **Types/Interfaces:** PascalCase (`Character`, `CharacterStats`, `StoryScenario`)

### TypeScript
- Strict mode enabled; `noFallthroughCasesInSwitch: true`
- `noUnusedLocals` and `noUnusedParameters` are both **false** (relaxed) for app code
- String literal union types for enums: `'text' | 'image' | 'voice'`, `'SSR' | 'SR' | 'R'`
- Functional components typed inline: `({ data }: { data: Type }) => ...`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports

### React Patterns
- All functional components using hooks (`useState`, `useEffect`, `useRef`, `useMemo`)
- No external state management library — all state via `useState` in main `LoveSignalSim` component
- Conditional rendering with `&&` and ternary operators
- List rendering with `.map()`
- Navigation via state variables (`activeTab`, view-specific state flags) — no routing library

### Styling
- Tailwind CSS utility classes as primary styling method
- Custom CSS for animations (`@keyframes`) and complex responsive layouts
- Mobile-first responsive design with `@media (max-width: 768px)`
- Inline `<style>` blocks at the end of `App.tsx` for component-scoped animations (shake, float, slideLeft, glitch, zoomIn, scanline, etc.)

### Game Data
- Characters, scenarios, endings, and social data defined as typed constants
- 9-episode branching narrative (ep1–ep9)
- 3 playable character routes (Lu Xingci, Shen Yu, Jiang Zhe)
- Character stats: `heartbeat`, `jealousy`, `syncRate`, `mood`, `trait`, `cpRate`
- Endings have types: `'True End' | 'Normal End' | 'Bad End'` with `requiredHeartbeat` thresholds

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
- `mobile.css` includes: safe area insets, 100dvh viewport fix, 44x44px min touch targets, momentum scrolling, tap highlight removal, backdrop-filter support, landscape handling, high-DPI optimization
- `index.html` sets `viewport-fit=cover`, disables user scaling, and includes Apple mobile web app meta tags
- Language: `zh-CN`

## Key Architectural Notes

- **Single-file architecture**: The entire app lives in `App.tsx`. When making changes, locate the relevant section by line range before editing. Use the section table above as a guide.
- **No routing library**: Navigation is handled via state (`activeTab` and view-specific state variables in `LoveSignalSim`).
- **No external API calls**: All game data is embedded as constants.
- **No test suite**: There are no tests. Verify changes with `npm run build` (type-check + build) and `npm run lint`.
- **Production dependencies are minimal**: `react`, `react-dom`, `lucide-react`.
- **Vite uses rolldown-vite**: The `vite` package is overridden to `rolldown-vite@7.2.5` in package.json.
