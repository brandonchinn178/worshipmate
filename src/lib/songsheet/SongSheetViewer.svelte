<script lang="ts">
  import ArrowRightAltRoundedIcon from "@iconify-svelte/material-symbols/arrow-right-alt-rounded"

  import { renderChord } from "./chord"
  import type { Key, SongSheet, SongSheetGoto, SongSheetPartMeta, SongSheetSection } from "./sheet"

  let { sheet, key }: { sheet: SongSheet; key: Key } = $props()

  const setWidths = (songLine: HTMLDivElement) => {
    const run = async () => {
      await document.fonts.ready

      const [chordsTrack, lyricsTrack] = songLine.children
      for (const i of Array(chordsTrack.children.length).keys()) {
        const chordDiv = chordsTrack.children[i] as HTMLSpanElement
        const lyricDiv = lyricsTrack.children[i] as HTMLSpanElement
        const width = Math.max(
          chordDiv.getBoundingClientRect().width,
          lyricDiv.getBoundingClientRect().width,
        )
        chordDiv.style.width = `${width}px`
        lyricDiv.style.width = `${width}px`
      }
    }
    run()
  }

  // An explicit space, to put spaces between chords/lyrics in copy/paste.
  // Defining constant to avoid react/jsx-curly-brace-presence lint error
  const SPACE = " "
</script>

{#each sheet.parts as part, i (i)}
  {#if part.type === "section"}
    {@render partSection(part)}
  {:else if part.type === "goto"}
    {@render partGoto(part)}
  {:else}
    {void (part satisfies never)}
  {/if}
{/each}

{#snippet partSection(part: SongSheetSection)}
  <section>
    <h3>{@render label(part.label, part.meta)}</h3>
    {#each part.lines as line, i (i)}
      <div class="song-line" use:setWidths>
        <!-- Chords track -->
        <div class="track">
          {#each line.pieces as piece, i (i)}
            <span class="chord">
              {#if "chord" in piece}
                <span class={{ leading: "space" in piece }}>
                  {renderChord(piece.chord, { base: key })}
                </span>
              {/if}
            </span>
            {SPACE}
          {/each}
        </div>
        <!-- Lyrics track -->
        <div class="track">
          {#each line.pieces as piece, i (i)}
            <span class="lyrics">
              {#if "lyrics" in piece}
                <span>{piece.lyrics}</span>
              {:else if "space" in piece}
                <span class="space"></span>
              {/if}
            </span>
            {SPACE}
          {/each}
        </div>
      </div>
    {/each}
  </section>
{/snippet}

{#snippet partGoto(part: SongSheetGoto)}
  <div class="goto">
    <p>
      <ArrowRightAltRoundedIcon height="1em" />
      {@render label(part.label, part.meta)}
    </p>
  </div>
{/snippet}

{#snippet label(name: string, meta: SongSheetPartMeta)}
  {name}
  {#if "repeat" in meta}
    <span class="meta-repeat">({meta.repeat}x)</span>
  {/if}
{/snippet}

<style>
  section {
    margin: 1em 0;

    .song-line {
      .track {
        display: flex;
        flex-wrap: wrap;
      }

      .chord {
        span:not(.leading) {
          padding-right: 1em;
        }
      }

      .lyrics {
        span {
          white-space: pre-wrap;
        }
        .space {
          display: inline-block;
          width: 2em;
        }
      }
    }
  }

  .goto {
    p {
      display: inline-flex;
      margin: 0.2em 0;

      padding-left: 0.2rem;
      padding-right: 0.5rem;
      border: 1px solid var(--black);

      font-style: italic;

      gap: 0.4em;
      align-items: center;
    }
  }

  .meta-repeat {
    font-weight: bold;
    font-style: italic;
  }
</style>
