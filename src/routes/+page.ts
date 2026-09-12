import { getSearchFilters } from "$lib/search.js"
import { listSongs } from "$lib/song"

export const load = async ({ url }) => {
  const search = getSearchFilters(url)
  const songs = await listSongs({ search: search.query })
  return { songs }
}
