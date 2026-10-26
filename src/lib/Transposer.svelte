<script lang="ts">
  import { type Song, transposeSong } from "$lib/song/model"

  import { renderKey } from "./songsheet/key"

  let { song = $bindable() }: { song: Song } = $props()

  let n = $state(0)
  const originalSong = song

  const transpose = (delta: number) => () => {
    n += delta
    song = transposeSong(originalSong, n)
  }

  const transposeStr = $derived((n > 0 ? "+" : "") + n.toString())
</script>

<div class="container">
  <button onclick={transpose(-1)}>-</button>
  <span class="key" title={transposeStr}>{renderKey(song.key)}</span>
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
