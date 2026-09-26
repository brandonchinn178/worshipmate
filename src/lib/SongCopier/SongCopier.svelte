<script lang="ts">
  import SettingsIcon from "@iconify-svelte/material-symbols/settings"
  import { Popover } from "bits-ui"
  import { toast } from "svelte-sonner"

  import * as Form from "$lib/form"
  import type { Song } from "$lib/song"

  import { Renderer, type RenderOptions } from "./render"
  import { getOptions, setOptions } from "./storage"

  let { song }: { song: Song } = $props()
  const initialOptions = getOptions()

  const formId = $props.id()
  const form = Form.init<RenderOptions>({
    id: formId,
    fields: {
      includeChords: { initial: initialOptions.includeChords },
    },
    onSubmit: async (values) => {
      try {
        await navigator.clipboard.writeText(Renderer.renderSong(song, values))
        toast.success("Copied to clipboard!")
      } catch (e) {
        console.error(e)
        toast.error(`Failed to copy: ${(e as Error).message}`)
      }
    },
  })

  $effect(() => {
    if (form.isValid) {
      setOptions(form.values as RenderOptions)
    }
  })
</script>

<div class="container">
  <button class="copy" onclick={form.onsubmit}>Copy</button>
  <Popover.Root>
    <Popover.Trigger class="settings"><SettingsIcon height="1em" /></Popover.Trigger>
    <Popover.Portal>
      <Popover.Content align="end" alignOffset={-34} sideOffset={5}>
        <Form.Form>
          <Form.Field name="includeChords" label="Include chords" direction="row">
            <Form.Checkbox {...form.field("includeChords")} />
          </Form.Field>
        </Form.Form>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</div>

<style>
  .container {
    display: flex;

    .copy {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    :global([data-popover-trigger].settings) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  :global([data-popover-trigger]) {
    line-height: 0;
    padding: 0.3rem;
  }

  :global([data-popover-content]) {
    /*border: 2px solid var(--light-gray);*/
    border-radius: 5px;
    background: var(--pink);
    padding: 0.5rem 1rem;
  }
</style>
