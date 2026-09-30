import { redirect } from "@sveltejs/kit"

import { resolve } from "$app/paths"

import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ parent }) => {
  const { session } = await parent()
  if (session !== null) {
    redirect(302, resolve("/"))
  }
}
