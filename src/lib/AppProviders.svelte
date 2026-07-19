<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query"
  import { onMount } from "svelte"

  import { loadAuth } from "$lib/auth.svelte"
  import { queryClient } from "$lib/tanstack-query"

  let { children } = $props()

  onMount(loadAuth)
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
