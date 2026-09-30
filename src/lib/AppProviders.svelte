<script lang="ts">
  import type { Snippet } from "svelte"
  import { Toaster } from "svelte-sonner"

  let { children }: { children: Snippet } = $props()
</script>

{@render children()}
<Toaster richColors />
