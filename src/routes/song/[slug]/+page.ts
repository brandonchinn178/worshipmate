import { error } from "@sveltejs/kit"

import { getSong } from "$lib/song"

export const load = async ({ params }) => {
  const song = await getSong(params.slug)
  if (!song) {
    error(404, `Song not found: ${params.slug}`)
  }

  return { song }
}
