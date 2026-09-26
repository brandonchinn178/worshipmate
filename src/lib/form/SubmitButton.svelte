<script lang="ts" generics="T extends BaseFormValues">
  import Spinner from "$lib/Spinner.svelte"

  import { type BaseFormValues, getForm } from "./init.svelte.ts"

  const form = getForm<T>()
  let { label = "Submit" }: { label?: string } = $props()
</script>

<div class="submit">
  {#if form.isPending}
    <Spinner height="2em" />
  {:else}
    <button>{label}</button>
  {/if}
</div>

<style>
  .submit {
    display: flex;
    justify-content: center;
  }
</style>
