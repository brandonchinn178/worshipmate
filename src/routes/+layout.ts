import { getAuthSession } from "$lib/auth.svelte"
import * as supabase from "$lib/supabase"

export const prerender = false
export const ssr = false

export const load = async ({ fetch, depends }) => {
  supabase.initClient({ fetch })
  const session = await getAuthSession({ depends })
  return { session }
}
