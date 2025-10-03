# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project type: Vite + React + TypeScript + Tailwind + shadcn/ui

Commands
- Install deps
  - npm i
- Dev server (Vite)
  - npm run dev
  - Dev server listens on port 8080 (see vite.config.ts). On Windows PowerShell, the command is identical.
- Build
  - npm run build
  - Development build variant
    - npm run build:dev
- Preview built app (serves dist/)
  - npm run preview
- Lint (ESLint flat config via eslint.config.js)
  - npm run lint
- Tests
  - No test runner is configured and there is no "test" script in package.json.

Notes for development
- Path alias: @ resolves to ./src (vite.config.ts and tsconfig paths). Import app code like import { Button } from "@/components/ui/button".
- Public assets: The /visualizer route relies on public/script.js and public/style.css plus external CDN scripts (cytoscape, dagre). Running the dev server with internet access is required for the full graph experience.
- Styling: Tailwind is configured via tailwind.config.ts and postcss.config.js. Design tokens and theme CSS variables live in src/index.css.

High-level architecture
- Entrypoint and app shell
  - index.html loads /src/main.tsx, which mounts <App /> into #root.
  - App.tsx composes providers: React Query (QueryClientProvider), shadcn Toaster components, TooltipProvider, and React Router.
- Routing
  - BrowserRouter with routes:
    - "/" → src/pages/Index.tsx (marketing/landing page with CTA buttons)
    - "/visualizer" → src/pages/Visualizer.tsx (interactive dependency visualizer)
    - catch-all "*" → src/pages/NotFound.tsx
- Visualizer page (hybrid integration)
  - Loads public/style.css and public/script.js at runtime and pulls Cytoscape/Dagre via CDN (unpkg).
  - public/script.js manages state (tasks) in localStorage, renders an interactive dependency graph (Cytoscape + dagre layout), a timeline view with zoom (days/weeks/months), import/export (JSON), critical path detection, search highlighting, and dark mode toggling.
  - The React page provides container scaffolding and navigation back to "/" via a shadcn Button.
- UI components
  - src/components/ui/* wraps shadcn/ui primitives (e.g., button.tsx, card.tsx, dialog.tsx) using tailwind-merge and class-variance-authority. These are consumed by pages for consistent styling.
- Utilities and hooks
  - src/lib/utils.ts exposes cn(...) for className composition.
  - src/hooks/use-mobile.tsx provides a simple viewport breakpoint detector.
- Build and tooling
  - Vite config (vite.config.ts):
    - Host "::" and port 8080 during dev
    - React SWC plugin
    - Aliases @ → ./src
    - Adds the "lovable-tagger" dev-only component tagger
  - TypeScript configs split between tsconfig.app.json and tsconfig.node.json. tsconfig.json sets baseUrl and @/* path mapping.
  - ESLint: eslint.config.js uses the flat config with @eslint/js, typescript-eslint, react-hooks, and react-refresh.

Key references
- README.md contains basic setup (Node/npm required, npm i, npm run dev) and context linking to Lovable.
