<script lang="ts">
  import { saveSong, type SongInput } from "$lib/song/queries"
  import SongForm from "$lib/SongForm.svelte"

  import type { PageProps } from "./$types"

  let { data }: PageProps = $props()
  const song = $derived(data.song)
</script>

<SongForm {song} save={(input: SongInput) => saveSong({ ...input, id: song.id })} />
