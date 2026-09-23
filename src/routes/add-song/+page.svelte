<script lang="ts">
  import * as Form from "$lib/form"
  import type { Key } from "$lib/songsheet/key"
  import { parseKey, parseSongSheet } from "$lib/songsheet/parser"
  import type { SongSheet } from "$lib/songsheet/sheet"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"

  type AddSongForm = {
    title: string
    artist: string
    key: Key
    sheet: { raw: string; parsed: SongSheet }
  }
  const formId = $props.id()
  let form = Form.init<AddSongForm>({
    id: formId,
    fields: {
      title: {
        initial: "",
        required: true,
      },
      artist: {
        initial: "",
        required: true,
      },
      key: {
        initial: "",
        required: true,
        parse: parseKey,
      },
      sheet: {
        initial: "",
        required: true,
        parse: (value) => {
          return { raw: value, parsed: parseSongSheet(value) }
        },
      },
    },
    onSubmit: async (values) => {
      console.log("TODO: submit", values)
    },
  })

  const sheetErrors = $derived(form.errors.get("sheet")?.trim())
  const keyErrors = $derived(form.errors.get("key")?.trim())
</script>

<main>
  <Form.Form>
    <Form.Field name="title" label="Title">
      <input {...form.field("title")} />
    </Form.Field>
    <Form.Field name="artist" label="Artist">
      <input {...form.field("artist")} />
    </Form.Field>
    <Form.Field name="key" label="Key">
      <input {...form.field("key")} />
    </Form.Field>
    <Form.Field name="sheet" label="Sheet">
      <textarea class="sheet-input" {...form.field("sheet")} wrap="off"></textarea>
    </Form.Field>
    <Form.SubmitButton />
  </Form.Form>
  {#if form.values.sheet && form.values.key}
    <div>
      <SongSheetViewer sheet={form.values.sheet.parsed} key={form.values.key} />
    </div>
  {:else if sheetErrors || keyErrors}
    <div class="song-sheet-error">
      <pre>Unable to render song sheet:</pre>
      {#if sheetErrors}
        <b><pre>- Sheet</pre></b>
        <pre>{sheetErrors}</pre>
      {/if}
      {#if keyErrors}
        <b><pre>- Key</pre></b>
        <pre>{keyErrors}</pre>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 1rem;
    align-items: start;
  }

  .sheet-input {
    height: 20rem;
    resize: none;
  }

  .song-sheet-error {
    color: var(--red);
    overflow-x: auto;
  }
</style>
