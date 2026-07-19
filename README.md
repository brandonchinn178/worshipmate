# WorshipMate

A website for worship leaders to browse songs for worshipping individually or corporately. Allows for easy key transposition and selection of full worship sets.

## Quickstart

1. `npm install`
2. `npm run dev`
3. `npx supabase start`

This runs the following services:
* UI: http://localhost:5173
* Supabase Studio: http://127.0.0.1:54323

Create a `.env` file containing:
```sh
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Migrations

1. `npx supabase migration new my_new_migration`
2. `npx supabase db reset`
3. `npx supabase gen types --lang typescript --local > src/lib/supabase/types.ts`
