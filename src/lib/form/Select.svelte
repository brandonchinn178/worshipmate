<script lang="ts">
  import Svelecte from "svelecte"
  import { onMount } from "svelte"
  import type { FormEventHandler } from "svelte/elements"

  import type { Option, Outputs } from "./Select"

  let {
    id,
    name,
    value,
    oninput,
    choices,
    creatable = false,
    placeholder = "",
    outputs = $bindable(),
  }: {
    id?: string | null
    name?: string | null
    value?: string | null
    oninput?: FormEventHandler<HTMLInputElement> | null
    choices: Option[] | Promise<Option[]>
    creatable?: boolean
    placeholder?: string | null
    outputs?: Outputs
  } = $props()

  let resolvedChoices = $state<Option[] | null>(null)
  onMount(async () => {
    resolvedChoices = await Promise.resolve(choices)
  })

  let lastCreatedOption = $state<string | null>(null)
  const onCreateOption = (option: Option) => {
    lastCreatedOption = option.value
  }

  const onChange = (option: Option | null) => {
    const value = option?.value ?? ""
    if (outputs) {
      outputs.isNew = value === lastCreatedOption
    }
    oninput?.({ currentTarget: { value } } as Event & { currentTarget: HTMLInputElement })
  }
</script>

{#if resolvedChoices === null}
  <input {id} {name} disabled />
{:else}
  <!-- TODO: set keepCreated=false - https://github.com/mskocik/svelecte/issues/325 -->
  <Svelecte
    name={name ?? undefined}
    inputId={id ?? undefined}
    options={resolvedChoices}
    value={value || null}
    {creatable}
    creatablePrefix=""
    allowEditing
    placeholder={placeholder ?? undefined}
    {onChange}
    {onCreateOption}
  />
{/if}

<style>
  :global(.sv-control) {
    --sv-border-radius: 0;
    --sv-border: 1px solid var(--light-gray);
    --sv-selection-gap: 0.25rem;
    --sv-icon-color: var(--light-gray);

    cursor: text;

    :global(.svelecte.is-focused) & {
      outline: 1px solid var(--highlight);
    }
    :global(.sv-input--text),
    :global(.sv-item--wrap) {
      padding: 0 !important;
    }
    :global(.sv-input--sizer) {
      /* Prevent slight size change on focus */
      position: relative !important;
    }
  }

  :global(.sv_dropdown) {
    :global(button.creatable-row) {
      /* Undo all the default button elements */
      font-family: inherit;
      font-size: 1em;
      text-transform: none;
      color: initial;
      &:hover {
        color: initial;
      }
    }
  }
</style>
