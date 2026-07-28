import { getAuthSession } from "$lib/auth.svelte"

export const prerender = false
export const ssr = false

export const load = async ({ depends }) => {
  const session = await getAuthSession({ depends })
  return { session }
}
