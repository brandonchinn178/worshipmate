import * as supabase from "@supabase/supabase-js"

import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

import type { Database } from "./types"

export type Client = supabase.SupabaseClient<Database>

const { promise: clientPromise, resolve: setClient } = Promise.withResolvers<Client>()
let clientInitialized = false

export type ClientOptions = {
  fetch: typeof fetch
}

export const initClient = async (options: ClientOptions): Promise<Client> => {
  // Client shows warning if multiple clients are initialized; reuse same one
  if (clientInitialized) {
    return await clientPromise
  }
  clientInitialized = true

  const client = supabase.createClient<Database>(
    // keep-multiline
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: options.fetch,
      },
    },
  )
  setClient(client)
  return client
}

export const getClient = (): Promise<Client> => clientPromise

/* A client that errors at runtime, but can be used to extract types. */
export const nullClient = null as unknown as Client
