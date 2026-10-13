<script lang="ts">
  import { addSong } from "$lib/song/queries"
  import SongForm from "$lib/SongForm.svelte"
</script>

<SongForm save={addSong} />
