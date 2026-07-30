<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"

  import { resolve } from "$app/paths"
  import { renderChord } from "$lib/songsheet/chord"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import Transposer from "$lib/Transposer.svelte"

  let { data } = $props()
  // svelte-ignore state_referenced_locally
  let song = $state(data.song)
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
  <div class="song-key">
    Key of {renderChord(song.key)}
    <div class="transpose">
      <Transposer bind:song />
    </div>
  </div>
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

  .song-key .transpose {
    display: inline-block;
    margin-left: 0.2em;
  }
</style>
