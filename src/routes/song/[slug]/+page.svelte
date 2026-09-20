<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"

  import { resolve } from "$app/paths"
  import { renderChord } from "$lib/songsheet/chord"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import Transposer from "$lib/Transposer.svelte"

  let { data } = $props()
  // svelte-ignore state_referenced_locally
  let song = $state(data.song)

  // Need to escape the slash to avoid the <script> block ending early
  // eslint-disable-next-line no-useless-escape
  const endScript = "<\/script>"

  const metadata = $derived({
    "@content": "https://schema.org",
    "@type": "SheetMusic",
    name: song.title,
    producer: song.artist,
  })
  const jsonLd = $derived(`
    <script type="application/ld+json">
      ${JSON.stringify(metadata).replace(/</g, "\\u003c")}
    ${endScript}
  `)
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html jsonLd}</svelte:head>

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
  <SongSheetViewer sheet={song.sheet} key={song.key.root} />
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
