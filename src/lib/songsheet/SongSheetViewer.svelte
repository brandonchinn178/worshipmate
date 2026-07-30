<script lang="ts">
  import ArrowRightAltRoundedIcon from "@iconify-svelte/material-symbols/arrow-right-alt-rounded"

  import { renderChord } from "./chord"
  import type { SongSheet, SongSheetGoto, SongSheetPartMeta, SongSheetSection } from "./types"

  let { sheet }: { sheet: SongSheet } = $props()
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
      <div class="song-line">
        <!-- Chords track -->
        {#each line.pieces as piece, i (i)}
          <div class="chord">
            {#if "chord" in piece}
              <span class={{ leading: "space" in piece }}>
                {renderChord(piece.chord)}
              </span>
            {/if}
          </div>
        {/each}
        <!-- Break -->
        <div class="row-break"></div>
        <!-- Lyrics track -->
        {#each line.pieces as piece, i (i)}
          <div class="lyrics">
            {#if "lyrics" in piece}
              <span>{piece.lyrics}</span>
            {:else if "space" in piece}
              <span class="space"></span>
            {/if}
          </div>
        {/each}
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
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, auto));

      .row-break {
        /* Force element to be on its own row */
        grid-column: 1 / -1;
        /* Force element to be invisible */
        height: 0;
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
