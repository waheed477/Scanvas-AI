# Scanvas - Web Accessibility Auditor

## Overview

Scanvas is a web accessibility auditing tool where users enter a website URL and receive a comprehensive accessibility report. The app runs axe-core accessibility tests via Puppeteer on the server side, scores the site from 0-100, categorizes issues by severity (critical, serious, moderate, minor), and stores audit history in a PostgreSQL database. Users can view past audits, see detailed violation breakdowns, and get fix suggestions with links to accessibility guidelines.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a single-repo fullstack architecture with three main directories:
- `client/` — React SPA frontend (Vite-based)
- `server/` — Express.js backend API
- `shared/` — Shared types, schemas, and route definitions used by both client and server

### Frontend (client/)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router, not React Router)
- **State/Data fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Animations**: Framer Motion for page transitions and interactive elements
- **Charts**: Recharts (used for score visualization)
- **Key pages**: Home (URL input + recent audits), Audit Details (score gauge + issue list), History (all past audits), About
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express.js running on Node with TypeScript (tsx runtime)
- **Accessibility Engine**: Puppeteer + @axe-core/puppeteer — launches a headless browser, navigates to the target URL, and runs axe-core analysis
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Storage Layer**: `DatabaseStorage` class implementing `IStorage` interface for clean abstraction over database operations
- **Dev Server**: Vite dev server is used as middleware in development for HMR; static files served in production from `dist/public`

### API Routes
All routes are defined in `shared/routes.ts` with Zod validation schemas:
- `POST /api/audits` — Create a new audit (accepts `{ url: string }`, runs Puppeteer + axe-core, stores results)
- `GET /api/audits` — List all audits (ordered by most recent)
- `GET /api/audits/:id` — Get a specific audit by ID

### Database
- **Database**: PostgreSQL (required, configured via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema** (in `shared/schema.ts`): Single `audits` table with columns:
  - `id` (serial, primary key)
  - `url` (text)
  - `score` (integer, 0-100)
  - `results` (jsonb — full axe-core output including violations, passes, incomplete, inapplicable)
  - `summary` (jsonb — count of critical/serious/moderate/minor/total issues)
  - `createdAt` (timestamp, auto-set)
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware for HMR
- **Production Build**: Custom `script/build.ts` that runs Vite build for client and esbuild for server, outputting to `dist/`
- **Production Start**: `npm start` runs the compiled `dist/index.cjs`

### Scoring Algorithm
The audit score starts at 100 and deducts points based on violation severity:
- Critical: -10 points each
- Serious: -5 points each
- Moderate: -2 points each
- Minor: -1 point each

## External Dependencies

### Required Services
- **PostgreSQL Database**: Must be provisioned and available via `DATABASE_URL` environment variable. Used for storing audit history.

### Key Libraries
- **Puppeteer**: Headless Chrome for loading target websites (requires `--no-sandbox` flags in containerized environments)
- **@axe-core/puppeteer**: Runs WCAG accessibility analysis on loaded pages
- **Drizzle ORM + drizzle-kit**: Database schema management and queries
- **Zod**: Runtime validation for API inputs/outputs, shared between client and server
- **shadcn/ui + Radix UI**: Component library foundation
- **Framer Motion**: Animation library for UI transitions
- **TanStack React Query**: Async state management for API calls
- **date-fns**: Date formatting utilities

### Environment Variables
- `DATABASE_URL` (required): PostgreSQL connection string
- `NODE_ENV`: Controls dev vs production behavior (Vite middleware vs static serving)