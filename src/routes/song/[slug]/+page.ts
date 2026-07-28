import { getSong } from "$lib/song"

export const load = async ({ params }) => {
  const song = await getSong(params.slug)
  return { song }
}
