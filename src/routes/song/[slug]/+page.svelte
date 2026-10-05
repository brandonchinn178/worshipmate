<script lang="ts">
  import ArrowLeftAltIcon from "@iconify-svelte/material-symbols/arrow-left-alt"

  import { resolve } from "$app/paths"
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

  // Force sidebar to the top if it would cover any of the song sections
  let sidebar = $state<HTMLElement | null>(null)
  $effect(() => {
    if (!sidebar) return

    const getBodyWidth = () => document.body.getBoundingClientRect().width
    const sidebarRect = sidebar.getBoundingClientRect()
    const sidebarLeftFromEnd = getBodyWidth() - sidebarRect.left

    // On mount, get the sections that are on the same horizontal line
    // as the sidebar
    const sections = [...document.querySelectorAll("section")]
      .map((section) => section.getBoundingClientRect())
      .filter((rect) => rect.top < sidebarRect.bottom)

    // On mount + window resize, check if any sections would be covered
    const update = () => {
      const boundary = getBodyWidth() - sidebarLeftFromEnd
      const covering = sections.some((rect) => rect.right >= boundary)
      const coverClass = "sidebar-covers"
      if (covering) {
        document.body.classList.add(coverClass)
      } else {
        document.body.classList.remove(coverClass)
      }
    }

    update() // initial check on mount

    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    observer.observe(sidebar)

    return () => observer.disconnect()
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
    <SongSheetViewer sheet={song.sheet} key={song.key} />
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

  :global(body.mobile, body.sidebar-covers) {
    .main-container {
      margin-top: 0;
    }

    .song-sidebar {
      position: static;
      margin: 1rem 0;
      float: none;
      width: calc(100vw - 6rem);
      min-width: min-content;
    }
  }
</style>
