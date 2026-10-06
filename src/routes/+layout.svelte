<script lang="ts">
  import "../app.css"

  import { MediaQuery } from "svelte/reactivity"

  import { page } from "$app/state"
  import AppProviders from "$lib/AppProviders.svelte"
  import Header from "$lib/Header.svelte"

  import { type LayoutProps } from "./$types"

  let { children }: LayoutProps = $props()

  let showHeader = $derived(page.data.header ?? true)

  const isMobile = new MediaQuery("max-width: 680px")
  $effect(() => {
    document.body.classList.toggle("mobile", isMobile.current)
  })
</script>

<svelte:head>
  <title>{page.data.title ? `${page.data.title} |` : ""} WorshipMate</title>
  {#if page.data.description}
    <meta name="description" content={page.data.description} />
  {/if}
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

  :global(body.mobile) .content {
    width: 100vw;
    overflow-x: auto;
  }
</style>
