# WorshipMate

A website for worship leaders to browse songs for worshipping individually or corporately. Allows for easy key transposition and selection of full worship sets.

## Quickstart

1. `npm install`
2. `npm run dev`
3. `npx supabase start`
4. `npm run add-admin-user admin@example.com testpassword`

This runs the following services:
* UI: http://localhost:5173
* Supabase Studio: http://127.0.0.1:54323

Create a `.env` file containing:
```sh
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Migrations

1. `npx supabase migration new my_new_migration`
2. `npx supabase db reset`
3. `npm run gen-supabase-types`

## Deployment

### Set Anthropic API Key

```sql
SELECT vault.create_secret('<api key>', 'anthropic_api_key');
```

### Backup

Regularly back up database:

```sh
npx supabase db dump --linked --use-copy --data-only > worshipmate-backup-$(date +%Y%m%d).sql
```
