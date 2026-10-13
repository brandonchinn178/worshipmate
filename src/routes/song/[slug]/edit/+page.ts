import { error } from "@sveltejs/kit"

import { getSong } from "$lib/song/queries"

import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ params }) => {
  const song = await getSong(params.slug)
  if (!song) {
    error(404, `Song not found: ${params.slug}`)
  }

  return { song, title: song.title }
}
