<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query"
  import { Toaster } from "svelte-sonner"

  import { queryClient } from "$lib/tanstack-query"

  let { queryClient: queryClientProp = null, children } = $props()
</script>

<QueryClientProvider client={queryClientProp ?? queryClient}>
  {@render children()}
  <Toaster richColors />
</QueryClientProvider>
