<script lang="ts">
  import "../app.css"

  import { page } from "$app/state"
  import AppProviders from "$lib/AppProviders.svelte"
  import Header from "$lib/Header.svelte"

  let { children } = $props()

  let showHeader = $derived(page.data.header ?? true)
</script>

<svelte:head>
  <title>WorshipMate</title>
</svelte:head>

<AppProviders>
  <div class="container">
    {#if showHeader}
      <Header />
    {/if}

    <div class="content">
      {@render children()}
    </div>
  </div>
</AppProviders>

<style>
  .container {
    min-width: min-content;
  }

  .content {
    padding: 1rem;
  }
</style>
