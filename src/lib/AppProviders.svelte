<script lang="ts">
  import { onMount } from "svelte"

  import { loadAuth } from "$lib/auth.svelte"

  let { children } = $props()

  onMount(loadAuth)
</script>

{@render children()}
