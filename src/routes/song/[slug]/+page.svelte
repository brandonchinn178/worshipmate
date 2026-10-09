<script lang="ts">
  import OpenInNewIcon from "@iconify-svelte/material-symbols/open-in-new"

  import SongCopier from "$lib/SongCopier"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import Transposer from "$lib/Transposer.svelte"
  import { VocalRangeDiagram } from "$lib/VocalRange"

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

<div class="main-container">
  <main>
    <h1>{song.title}</h1>
    <h2>{song.artist}</h2>
    <SongSheetViewer sheet={song.sheet} key={song.key} />
  </main>
  {@render songSidebar()}
</div>

{#snippet songSidebar()}
  <aside class="song-sidebar">
    <div class="song-link">
      <a href={song.link} rel="external">
        Link to song
        <span class="open-link-icon"><OpenInNewIcon height="1em" /></span>
      </a>
    </div>
    <div class="song-key">
      <label for="">Key</label>
      <Transposer bind:song />
    </div>
    <div class="song-vocal-range">
      <label for="">Vocal Range</label>
      <VocalRangeDiagram range={song.vocalRange} key={song.key} width="12rem" />
    </div>
    <div class="copy">
      <SongCopier {song} />
    </div>
  </aside>
{/snippet}

<style>
  .main-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    align-items: start;
  }

  .song-sidebar {
    margin-left: 2rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem;
    gap: 1rem;
    border: 4px double var(--primary);
    background: var(--white);

    label {
      color: var(--primary);
      font-size: 1.5em;
    }
  }

  .song-link .open-link-icon {
    margin-left: 0.3rem;
  }

  .song-vocal-range {
    text-align: center;
  }

  .song-key {
    white-space: nowrap;
  }

  :global(body.mobile) {
    .main-container {
      grid-template-columns: none;
      grid-template-areas:
        "sidebar"
        "main";
      grid-template-rows: min-content 1fr;
    }

    .song-sidebar {
      grid-area: sidebar;
      margin: 1rem 0;
      width: min-content;
    }
  }
</style>
