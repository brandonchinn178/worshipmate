<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"
  import { onMount } from "svelte"
  import { innerWidth } from "svelte/reactivity/window"

  import { resolve } from "$app/paths"
  import SongCopier from "$lib/SongCopier"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import Transposer from "$lib/Transposer.svelte"
  import { takeWhile } from "$lib/utils/lang"
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

  // Force sidebar to the top if it would cover any of the song sections
  const bodyWidth = $derived.by(() => {
    const width = innerWidth.current
    if (width === undefined) {
      // shouldn't happen; it's only undefined on the server
      throw new Error("innerWidth not defined")
    }
    return width
  })
  let sidebar = $state<HTMLElement | null>(null)
  const sidebarRect = $derived(sidebar?.getBoundingClientRect())
  let mountData = $state<null | {
    // keep-multiline
    numOverlappableSections: number
    sidebarLeftFromEnd: number
  }>(null)
  const updateSidebar = () => {
    if (!mountData) return

    const boundary = bodyWidth - mountData.sidebarLeftFromEnd
    const sidebarWouldOverlap = document
      .querySelectorAll("section")
      .values()
      .take(mountData.numOverlappableSections)
      .some((section) => section.getBoundingClientRect().right >= boundary)
    document.body.classList.toggle("sidebar-overlaps", sidebarWouldOverlap)
  }
  onMount(() => {
    if (!sidebarRect) {
      throw new Error("sidebar not set on mount")
    }

    const overlappableSections = takeWhile(
      document.querySelectorAll("section"),
      (section) => section.getBoundingClientRect().top < sidebarRect.bottom,
    )
    mountData = {
      numOverlappableSections: overlappableSections.toArray().length,
      sidebarLeftFromEnd: bodyWidth - sidebarRect.left,
    }
    updateSidebar()
  })
  $effect(() => {
    void bodyWidth
    updateSidebar()
  })
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
  {@render songSidebar()}
  <main>
    <h1>{song.title}</h1>
    <h2>{song.artist}</h2>
    <SongSheetViewer sheet={song.sheet} key={song.key} onSongLineInit={updateSidebar} />
  </main>
</div>

{#snippet songSidebar()}
  <aside bind:this={sidebar} class="song-sidebar">
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
  .backlink {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
  }

  .main-container {
    position: relative;
    margin: 2rem;
  }

  .song-sidebar {
    position: absolute;
    right: 0;
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

  .song-vocal-range {
    text-align: center;
  }

  .song-key {
    white-space: nowrap;
  }

  :global(body.mobile, body.sidebar-overlaps) {
    .main-container {
      margin-top: 0;
    }

    .song-sidebar {
      position: static;
      float: none;
      margin: 1rem 0;
      width: min-content;
    }
  }
</style>
