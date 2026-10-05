<script lang="ts">
  import type { FormEventHandler } from "svelte/elements"

  import { fromVocalRangeRawInput, toVocalRangeRawInput } from "./VocalRangeInput"

  const {
    id,
    value,
    oninput,
  }: {
    id?: string | null
    value?: string | null
    oninput?: FormEventHandler<HTMLInputElement> | null
  } = $props()

  const [lo, hi] = $derived(fromVocalRangeRawInput(value ?? ""))
  const mkHandleInput =
    (type: "lo" | "hi"): FormEventHandler<HTMLInputElement> =>
    (e) => {
      const input = e.currentTarget.value
      const values: [string, string] = type === "lo" ? [input, hi] : [lo, input]
      const rawValue = toVocalRangeRawInput(values)
      if (oninput) {
        oninput({ currentTarget: { value: rawValue } } as Event & {
          currentTarget: HTMLInputElement
        })
      }
    }
</script>

<div class="vocal-range">
  <input {id} value={lo} oninput={mkHandleInput("lo")} />
  <span>&mdash;</span>
  <input value={hi} oninput={mkHandleInput("hi")} />
</div>

<style>
  .vocal-range {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.5rem;
    input {
      min-width: 0;
    }
  }
</style>
