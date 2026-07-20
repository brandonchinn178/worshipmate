<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query"
  import { Toaster } from "svelte-sonner"

  import { queryClient } from "$lib/tanstack-query"

  let { children } = $props()
</script>

<QueryClientProvider client={queryClient}>
  {@render children()}
  <Toaster richColors />
</QueryClientProvider>
