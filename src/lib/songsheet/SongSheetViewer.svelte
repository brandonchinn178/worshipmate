<script lang="ts">
  import ArrowRightAltRoundedIcon from "@iconify-svelte/material-symbols/arrow-right-alt-rounded"

  import { assertNever, range } from "$lib/utils/lang"

  import { renderChord } from "./chord"
  import type {
    Key,
    SongSheet,
    SongSheetGoto,
    SongSheetLine,
    SongSheetPartMeta,
    SongSheetSection,
  } from "./sheet"

  let { sheet, key }: { sheet: SongSheet; key: Key } = $props()

  // Minimum amount of space needed after a chord
  const CHORD_SPACE = 20

  const setWidths = (line: SongSheetLine) => (songLine: HTMLDivElement) => {
    // Just register `line` as a dependency, to rerun whenever it changes, e.g.
    // after transposing song
    void line

    const [chordsTrack, lyricsTrack] = songLine.children
    const divs = [...range(0, chordsTrack.children.length)].map(
      (i) =>
        [chordsTrack.children[i], lyricsTrack.children[i]] as [HTMLSpanElement, HTMLSpanElement],
    )

    const run = async () => {
      await document.fonts.ready

      divs.forEach(([chordSpan, lyricSpan]) => {
        const leading = chordSpan.classList.contains("leading")
        const width = Math.max(
          chordSpan.getBoundingClientRect().width + (leading ? 0 : CHORD_SPACE),
          lyricSpan.getBoundingClientRect().width,
        )
        chordSpan.style.width = `${width.toString()}px`
        lyricSpan.style.width = `${width.toString()}px`
      })
    }
    void run()

    return () => {
      divs.forEach(([chordSpan, lyricSpan]) => {
        chordSpan.style.width = "initial"
        lyricSpan.style.width = "initial"
      })
    }
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
    {assertNever(part)}
  {/if}
{/each}

{#snippet partSection(part: SongSheetSection)}
  <section>
    <h3>{@render label(part.label, part.meta)}</h3>
    {#each part.lines as line, i (i)}
      <div class="song-line" {@attach setWidths(line)}>
        <!-- Chords track -->
        <div class="track">
          {#each line.pieces as piece, i (i)}
            <span class="chord">
              {#if "chord" in piece}
                <span class={{ leading: "space" in piece }}>
                  {renderChord(piece.chord, { key })}
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
          {:else}
            <span><br /></span>
          {/each}
        </div>
      </div>
    {/each}
  </section>
{/snippet}

{#snippet partGoto(part: SongSheetGoto)}
  <div class="goto">
    <p>
      <ArrowRightAltRoundedIcon height="1em" aria-label="Go to" />
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
    width: min-content;

    .song-line {
      .track {
        display: flex;
      }

      .lyrics {
        span {
          white-space: pre-wrap;
          text-wrap: nowrap;
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
