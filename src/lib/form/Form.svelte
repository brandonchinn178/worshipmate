<script lang="ts" generics="T extends BaseFormValues">
  import type { Snippet } from "svelte"

  import { type BaseFormValues, getForm } from "./init.svelte"

  let {
    children,
    onSubmit,
  }: {
    children: Snippet
    onSubmit: () => Promise<void>
  } = $props()

  const form = getForm<T>()
</script>

<form onsubmit={form.onsubmit(onSubmit)}>
  {@render children()}
</form>

<style>
  form {
    display: grid;
    gap: 1rem;
  }
</style>
