<script lang="ts">
  import CheckIcon from "@iconify-svelte/material-symbols/check"
  import { Checkbox } from "bits-ui"
  import type { ChangeEventHandler } from "svelte/elements"

  let {
    id,
    name,
    checked,
    onchange,
  }: {
    id?: string | null
    name?: string | null
    checked?: boolean | null
    onchange?: ChangeEventHandler<HTMLInputElement> | null
  } = $props()
</script>

<Checkbox.Root
  id={id ?? undefined}
  name={name ?? undefined}
  checked={checked ?? undefined}
  onCheckedChange={(checked: boolean) => {
    onchange?.({ currentTarget: { checked } } as Event & { currentTarget: HTMLInputElement })
  }}
>
  {#snippet children({ checked })}
    {#if checked}
      <CheckIcon height="0.8em" />
    {/if}
  {/snippet}
</Checkbox.Root>

<style>
  :global([data-checkbox-root]) {
    padding: 0;
    width: 1em;
    height: 1em;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: var(--white);
      color: var(--primary);
    }

    &[data-state="checked"] {
      background: var(--primary);
      color: var(--white);
    }
  }
</style>
