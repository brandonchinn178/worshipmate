import * as supabase from "@supabase/supabase-js"

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

import type { Database } from "./types"

export type Client = supabase.SupabaseClient<Database>

let client: Client | null = null

export type ClientOptions = {
  fetch: typeof fetch
}

export const initClient = (options: ClientOptions): Client => {
  // Client shows warning if multiple clients are initialized; reuse same one
  if (client !== null) {
    return client
  }

  const newClient = supabase.createClient(
    // keep-multiline
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: options.fetch,
      },
    },
  )
  client = newClient
  return newClient
}

export const getClient = (): Client => {
  if (client === null) {
    throw new Error("getClient called before initClient")
  }
  return client
}

/* A client that errors at runtime, but can be used to extract types. */
export const nullClient = null as unknown as Client
