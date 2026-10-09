<script lang="ts">
  import { toast } from "svelte-sonner"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import * as Form from "$lib/form"
  import { addSong, listArtists } from "$lib/song/queries"
  import { toKey } from "$lib/songsheet/key"
  import { parseKey, parseSongSheet } from "$lib/songsheet/parser"
  import type { Key, SongSheet } from "$lib/songsheet/sheet"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import { parseVocalRangeInput, type VocalRange, VocalRangeInput } from "$lib/VocalRange"

  type AddSongForm = {
    title: string
    artist: string
    key: Key
    vocalRange: VocalRange
    link: string
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
      vocalRange: {
        initial: "",
        required: true,
        parse: parseVocalRangeInput,
      },
      link: {
        initial: "",
        required: true,
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
          vocalRange: values.vocalRange,
          link: values.link,
          sheet: values.sheet.raw,
        })

        await goto(resolve("/song/[slug]", { slug: song.slug }))
      } catch (e) {
        toast.error((e as Error).message)
      }
    },
  })

  let artistSelector = $state(Form.initSelectOutputs())
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
      <Form.Select
        {...form.field("artist")}
        choices={loadArtistChoices()}
        creatable
        bind:outputs={artistSelector}
      />
    </Form.Field>
    <Form.Field name="key" label="Key">
      <input {...form.field("key")} />
    </Form.Field>
    <Form.Field name="vocalRange" label="Vocal range">
      <VocalRangeInput {...form.field("vocalRange")} />
    </Form.Field>
    <Form.Field name="link" label="Link">
      <input {...form.field("link")} />
    </Form.Field>
    <Form.Field name="sheet" label="Sheet">
      <textarea class="sheet-input" {...form.field("sheet")} wrap="off"></textarea>
    </Form.Field>
    <Form.SubmitButton />
  </Form.Form>
  {#if form.values.sheet}
    <div>
      <SongSheetViewer sheet={form.values.sheet.parsed} key={form.values.key ?? toKey("C")} />
    </div>
  {:else if sheetErrors || keyErrors}
    <div class="song-sheet-error">
      <pre>Unable to render song sheet:</pre>
      {#if sheetErrors}
        <b><pre>- Sheet</pre></b>
        <pre>{sheetErrors}</pre>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 20rem 1fr;
    gap: 3rem;
    align-items: start;

    max-width: 70rem;
    margin: 0 auto;
  }

  .sheet-input {
    height: 20rem;
    resize: none;
    font-family: monospace;
  }

  .song-sheet-error {
    color: var(--red);
    overflow-x: auto;
  }
</style>
