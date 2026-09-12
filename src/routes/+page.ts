import { getSearchFilters } from "$lib/search.js"
import { listSongs } from "$lib/song"

export const load = async (page) => {
  const search = getSearchFilters(page.url)
  const songs = await listSongs({ search: search.query })
  return { songs }
}
