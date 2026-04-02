# Equipa

Frontend application built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Create a `.env.local` file in the project root with the following values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

These values are used in `src/integrations/supabase/client.ts`.

## 3) Start the development server

```bash
npm run dev
```

By default, Vite runs at:

- http://localhost:8080/

To expose it on your local network:

```bash
npm run dev -- --host
```

## Useful scripts

Run lint:

```bash
npm run lint
```

Run tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Optional: Supabase local stack

This repository includes Supabase configuration in `supabase/config.toml` and SQL migrations in `supabase/migrations/`.

If you want to run Supabase locally, install the Supabase CLI and start it from the project root.
