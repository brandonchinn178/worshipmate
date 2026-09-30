<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"

  import { resolve } from "$app/paths"
  import SongCopier from "$lib/SongCopier"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import Transposer from "$lib/Transposer.svelte"

  import type { PageProps } from "./$types"

  let { data }: PageProps = $props()
  // svelte-ignore state_referenced_locally
  let song = $state(data.song)

  const metadata = $derived({
    "@content": "https://schema.org",
    "@type": "SheetMusic",
    name: song.title,
    producer: song.artist,
  })
  const jsonLd = $derived(`
    <script type="application/ld+json">
      ${JSON.stringify(metadata).replace(/</g, "\\u003c")}
    </${"script>" /* Need to obfuscate to avoid Svelte parser from ending script block */}
  `)
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html jsonLd}</svelte:head>

<p>
  <a class="backlink" href={resolve("/")}>
    <ArrowLeftAltIcon height="1em" aria-hidden />
    Back to song list
  </a>
</p>
<div class="main-container">
  <aside class="song-actions">
    <div class="song-key">
      Key:
      <Transposer bind:song />
    </div>
    <div class="copy">
      <SongCopier {song} />
    </div>
  </aside>
  <main>
    <h1>{song.title}</h1>
    <h2>{song.artist}</h2>
    <SongSheetViewer sheet={song.sheet} key={song.key} />
  </main>
</div>

<style>
  .backlink {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
  }

  .main-container {
    margin: 2rem;
  }

  .song-actions {
    float: right;
    margin-left: 2rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem;
    gap: 1rem;
    border: 4px double var(--primary);
    background: var(--white);
  }

  .song-key {
    white-space: nowrap;
  }
</style>
