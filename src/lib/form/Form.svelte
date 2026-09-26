<script lang="ts" generics="T extends BaseFormValues">
  import type { Snippet } from "svelte"

  import { type BaseFormValues, getForm } from "./init.svelte.ts"

  let { children }: { children: Snippet } = $props()

  const form = getForm<T>()
</script>

<form onsubmit={form.onsubmit}>
  {@render children()}
</form>

<style>
  form {
    display: grid;
    gap: 1rem;
  }
</style>
