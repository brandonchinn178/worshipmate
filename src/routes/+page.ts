import { listSongs } from "$lib/song"

export const load = async () => {
  const songs = await listSongs()
  return { songs }
}
