<script lang="ts" generics="T extends BaseFormValues">
  import type { Snippet } from "svelte"

  import { type BaseFormValues, type FieldName, getForm } from "./init.svelte"

  const form = getForm<T>()
  let {
    name,
    label,
    children,
  }: {
    name: FieldName<T>
    label: string
    children: Snippet
  } = $props()

  const errors = $derived(form.errors.get(name))
</script>

<div class="field">
  <label for={form.fieldId(name)}>{label}</label>
  {@render children()}
  {#if form.touched[name] && errors}
    <p class="error">{errors}</p>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
  }

  label {
    font-family: var(--font-alegreya-sc);
    text-transform: lowercase;
  }

  .error {
    color: var(--red);
  }
</style>
