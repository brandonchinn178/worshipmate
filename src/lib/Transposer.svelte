<script lang="ts">
  import EditIcon from "@iconify-svelte/material-symbols/edit"

  import { type Song, transposeSong } from "$lib/song"

  let { song = $bindable() }: { song: Song } = $props()

  let transposeActive = $state(false)
</script>

{#if !transposeActive}
  <span
    class="edit-icon"
    onclick={() => {
      transposeActive = true
    }}
    onkeydown={(e) => {
      switch (e.code) {
        case "Space":
        case "Enter":
          e.preventDefault()
          transposeActive = true
      }
    }}
    role="button"
    tabindex={0}
  >
    <EditIcon height="1em" />
  </span>
{:else}
  <!-- TODO: prettier -->
  <button
    onclick={() => {
      song = transposeSong(song, -1)
    }}>-</button
  >
  <button
    onclick={() => {
      song = transposeSong(song, 1)
    }}>+</button
  >
{/if}

<style>
  .edit-icon {
    color: var(--primary);

    &:hover {
      cursor: pointer;
      color: var(--secondary);
    }
  }
</style>
