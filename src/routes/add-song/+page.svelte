<script lang="ts">
  import { toast } from "svelte-sonner"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import * as Form from "$lib/form"
  import { addSong, listArtists } from "$lib/song/queries"
  import { parseChord, parseSongSheet } from "$lib/songsheet/parser"
  import type { Chord, SongSheet } from "$lib/songsheet/sheet"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"

  type AddSongForm = {
    title: string
    artist: string
    key: Chord
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
        parse: parseChord,
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
      try {
        const song = await addSong({
          title: values.title,
          artist: artistSelector.isNew ? { name: values.artist } : { id: values.artist },
          key: values.key,
          sheet: values.sheet.raw,
        })

        await goto(resolve("/song/[slug]", { slug: song.slug }))
      } catch (e) {
        toast.error((e as Error).message)
      }
    },
  })

  let artistSelector = $state(Form.initComboboxOutputs())
  const loadArtistChoices = async () => {
    const artists = await listArtists()
    return artists.map(({ id, name }) => ({ label: name, value: id }))
  }

  const sheetErrors = $derived(form.errors.sheet?.trim())
  const keyErrors = $derived(form.errors.key?.trim())
</script>

<main>
  <Form.Form>
    <Form.Field name="title" label="Title">
      <input {...form.field("title")} />
    </Form.Field>
    <Form.Field name="artist" label="Artist">
      <Form.Combobox
        {...form.field("artist")}
        choices={loadArtistChoices()}
        allowNew
        bind:outputs={artistSelector}
      />
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
