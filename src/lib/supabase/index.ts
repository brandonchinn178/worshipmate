import * as supabase from "@supabase/supabase-js"

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

import type { Database } from "./types"

export type Client = supabase.SupabaseClient<Database>

export const client: Client = supabase.createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY,
)
