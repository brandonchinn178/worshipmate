import type { Session } from "@supabase/supabase-js"

import { invalidate } from "$app/navigation"
import * as supabase from "$lib/supabase"

const AUTH_KEY = "app:auth" as const

export type AuthSessionLoader = {
  depends: (...deps: `${string}:${string}`[]) => void
}

export const getAuthSession = async ({ depends }: AuthSessionLoader): Promise<Session | null> => {
  depends(AUTH_KEY)
  const { data } = await supabase.client.auth.getSession()
  return data.session
}

export type LoginInput = {
  email: string
  password: string
}

export const login = async (input: LoginInput) => {
  const { error } = await supabase.client.auth.signInWithPassword(input)
  if (error) {
    throw error
  }
  await invalidate(AUTH_KEY)
}
