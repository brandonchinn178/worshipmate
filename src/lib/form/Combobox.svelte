<script module lang="ts">
  export type Option = {
    label: string
    value: string
  }

  const CREATE_PREFIX = "__create__:"
  const toCreateOption = (input: string): string => CREATE_PREFIX + input
  const fromCreateOption = (input: string): [string, boolean] =>
    input.startsWith(CREATE_PREFIX) ? [input.slice(CREATE_PREFIX.length), true] : [input, false]

  export type Outputs = {
    isNew: boolean
  }
  export const initComboboxOutputs = (): Outputs => {
    return {
      isNew: false,
    }
  }
</script>

<script lang="ts">
  import CheckIcon from "@iconify-svelte/material-symbols/check"
  import UnfoldMoreIcon from "@iconify-svelte/material-symbols/unfold-more"
  import { Combobox } from "bits-ui"
  import { onMount } from "svelte"
  import type { FormEventHandler } from "svelte/elements"

  import Spinner from "$lib/Spinner.svelte"

  let {
    id,
    name,
    value,
    oninput,
    choices,
    allowNew = false,
    outputs = $bindable(),
  }: {
    id?: string | null
    name?: string | null
    value?: string | null
    oninput?: FormEventHandler<HTMLInputElement> | null
    choices: Option[] | Promise<Option[]>
    allowNew?: boolean
    outputs?: Outputs
  } = $props()

  let resolvedChoices = $state<Option[] | null>(null)
  onMount(async () => {
    resolvedChoices = await Promise.resolve(choices)
  })

  let searchValue = $state("")

  const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
    searchValue = e.currentTarget.value.trim()
  }

  const applySearch = (choices: Option[]): Array<Option & { hint?: string }> => {
    const searchValueLower = searchValue.toLowerCase()
    const filtered = searchValue
      ? choices.filter(({ label }) => label.toLowerCase().includes(searchValueLower))
      : choices

    const exists = filtered.some(({ label }) => label === searchValue)
    const newOption =
      searchValue && allowNew && !exists // keep-multiline
        ? [
            {
              label: searchValue,
              hint: `Add: "${searchValue}"`,
              value: toCreateOption(searchValue),
            },
          ]
        : []

    return [...filtered, ...newOption]
  }
</script>

<div class="container">
  <Combobox.Root
    type="single"
    name={name ?? undefined}
    value={value ?? undefined}
    onValueChange={(input: string) => {
      const [value, isNew] = fromCreateOption(input)
      if (outputs) {
        outputs.isNew = isNew
      }

      oninput?.({ currentTarget: { value } } as Event & { currentTarget: HTMLInputElement })
    }}
  >
    <Combobox.Input id={id ?? undefined} oninput={handleSearch} />
    <Combobox.Trigger>
      {#snippet child({ props })}
        <span {...props}>
          <UnfoldMoreIcon height="1em" />
        </span>
      {/snippet}
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Content>
        {#if resolvedChoices === null}
          <span class="spinner-container"><Spinner height="1em" /></span>
        {:else}
          {#each applySearch(resolvedChoices) as { label, hint, value } (value)}
            <Combobox.Item {label} {value}>
              {#snippet children({ selected })}
                {#if selected}
                  <span class="checkmark"><CheckIcon height="1em" /></span>
                {/if}
                {hint ?? label}
              {/snippet}
            </Combobox.Item>
          {/each}
        {/if}
      </Combobox.Content>
    </Combobox.Portal>
  </Combobox.Root>
</div>

<style>
  .container {
    position: relative;
  }

  :global([data-combobox-input]) {
    width: 100%;
  }

  :global([data-combobox-trigger]) {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem;
    cursor: text;
    color: var(--primary);
  }

  :global([data-combobox-content]) {
    background: var(--secondary);
    width: var(--bits-combobox-anchor-width);
    max-height: 13rem;
    overflow-y: auto;
  }

  .spinner-container {
    display: block;
    text-align: center;
    padding: 0.2rem 1rem;
  }

  :global([data-combobox-item]) {
    cursor: pointer;
    padding: 0.2rem 1rem;
    padding-left: 1.5rem;

    position: relative;
    .checkmark {
      position: absolute;
      top: 2px;
      left: 2px;
      padding: 0.2rem;
    }

    &[data-highlighted] {
      background: var(--highlight);
    }
  }
</style>
