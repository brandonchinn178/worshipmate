import { getAuthSession } from "$lib/auth.svelte"
import * as supabase from "$lib/supabase"

import type { LayoutLoad } from "./$types"

export const prerender = false
export const ssr = false

export const load: LayoutLoad = async ({ fetch, depends }) => {
  supabase.initClient({ fetch })
  const session = await getAuthSession({ depends })
  return { session }
}
