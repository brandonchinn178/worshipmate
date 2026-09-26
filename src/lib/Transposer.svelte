<script lang="ts">
  import { type Song, transposeSong } from "$lib/song"

  import { renderChord } from "./songsheet/chord"

  let { song = $bindable() }: { song: Song } = $props()
  const transpose = (n: number) => () => {
    song = transposeSong(song, n)
  }
</script>

<div class="container">
  <button onclick={transpose(-1)}>-</button>
  <span class="key">{renderChord(song.key)}</span>
  <button onclick={transpose(1)}>+</button>
</div>

<style>
  .container {
    display: inline-block;
    margin: 0 0.5rem;
  }

  button {
    width: 1.5rem;
    padding: 0;
    font-weight: bold;
  }

  .key {
    display: inline-block;
    width: 2rem;
    text-align: center;
  }
</style>
