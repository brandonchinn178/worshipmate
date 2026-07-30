<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"

  import { resolve } from "$app/paths"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"

  let { data } = $props()
  const { song } = $derived(data)
</script>

<!-- TODO:
<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SheetMusic",
      "name": "{song.title}",
      "byArtist": "{song.artist}"
    }
  </script>
</svelte:head>
-->

<p>
  <a class="backlink" href={resolve("/")}>
    <ArrowLeftAltIcon height="1em" />
    Back to song list
  </a>
</p>
<main>
  <h1>{song.title}</h1>
  <h2>{song.artist}</h2>
  <p class="song-key">
    <!-- TODO: Transpose -->
    Key of {song.key}
  </p>
  <SongSheetViewer sheet={song.sheet} />
</main>

<style>
  .backlink {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
  }

  main {
    margin: 2rem;
  }
</style>
