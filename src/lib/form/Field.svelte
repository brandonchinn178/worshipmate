<script lang="ts" generics="T extends BaseFormValues">
  import type { Snippet } from "svelte"

  import { type BaseFormValues, type FieldName, getForm } from "./init.svelte.ts"

  const form = getForm<T>()
  let {
    name,
    label,
    direction = "column",
    children,
  }: {
    name: FieldName<T>
    label: string
    direction?: "column" | "row"
    children: Snippet
  } = $props()

  const errors = $derived(form.errors[name])

  const style = $derived(`
    flex-direction: ${direction};
    gap: ${direction === "row" ? "0.5rem" : "0"};
  `)
</script>

<div class="field" {style}>
  <label for={form.fieldId(name)}>{label}</label>
  {@render children()}
  {#if form.touched[name] && errors}
    <p class="error">{errors}</p>
  {/if}
</div>

<style>
  .field {
    display: flex;
  }

  label {
    font-family: var(--font-alegreya-sc);
    text-transform: lowercase;
    user-select: none;
  }

  .error {
    color: var(--red);
  }
</style>
