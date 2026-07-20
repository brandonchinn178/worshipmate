import type { Session } from "@supabase/supabase-js"
import { createMutation, createQuery } from "@tanstack/svelte-query"

import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { supabase } from "$lib/supabase"

export const createSessionQuery = () => {
  return createQuery<Session | null>(() => ({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session
    },
  }))
}

export type LoginInput = {
  email: string
  password: string
}

export const createLoginMutation = () => {
  return createMutation(() => ({
    mutationKey: ["login"],
    mutationFn: async (input: LoginInput) => {
      const { error } = await supabase.auth.signInWithPassword(input)
      if (error) throw error
    },
    onSuccess: async (_data, _variables, _onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ["session"] })
      goto(resolve("/"))
    },
  }))
}
