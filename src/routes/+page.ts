import { listSongs } from "$lib/song"

export const load = async (page) => {
  const search = page.url.searchParams.get("search") ?? ""
  const songs = await listSongs({ search })
  return { songs }
}
