<script lang="ts">
  import "../app.css"

  import { onMount } from "svelte"

  import { page } from "$app/state"
  import AppProviders from "$lib/AppProviders.svelte"
  import Header from "$lib/Header.svelte"

  import { type LayoutProps } from "./$types"

  let { children }: LayoutProps = $props()

  let showHeader = $derived(page.data.header ?? true)

  onMount(() => {
    const body = document.body
    const mq = window.matchMedia("(max-width: 680px)")
    const mobileClass = "mobile"
    const update = () => {
      if (mq.matches) {
        body.classList.add(mobileClass)
      } else {
        body.classList.remove(mobileClass)
      }
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
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
</style>
