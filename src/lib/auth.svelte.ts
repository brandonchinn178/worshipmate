import type { Session } from "@supabase/supabase-js"
import { toast } from "svelte-sonner"

import { invalidate } from "$app/navigation"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { supabase } from "$lib/supabase"

const AUTH_KEY = "app:auth" as const

export type AuthSessionLoader = {
  depends: (...deps: `${string}:${string}`[]) => void
}

export const getAuthSession = async ({ depends }: AuthSessionLoader): Promise<Session | null> => {
  depends(AUTH_KEY)
  const { data } = await supabase.auth.getSession()
  return data.session
}

export type LoginInput = {
  email: string
  password: string
}

export const login = async (input: LoginInput) => {
  const { error } = await supabase.auth.signInWithPassword(input)
  if (error) {
    toast.error(error.message)
  }
  invalidate(AUTH_KEY)
  goto(resolve("/"))
}
