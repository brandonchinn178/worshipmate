<script lang="ts">
  import slugify from "slugify"
  import { toast } from "svelte-sonner"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import * as Form from "$lib/form"
  import type { Key } from "$lib/songsheet/key"
  import { parseKey, parseSongSheet } from "$lib/songsheet/parser"
  import type { SongSheet } from "$lib/songsheet/sheet"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"
  import { getClient } from "$lib/supabase"

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
      const supabase = getClient()
      try {
        const { data: artist, error: artistError } = await supabase
          .from("artists")
          .upsert({ name: values.artist }, { onConflict: "name", ignoreDuplicates: true })
          .select("id")
          .single()
        if (artistError) throw artistError

        // TODO: handle duplicate slugs
        const slug = slugify(values.title, { lower: true })

        const { error: songError } = await supabase.from("songs").insert({
          slug,
          title: values.title,
          artist: artist.id,
          key: values.key,
          sheet: values.sheet.raw,
        })
        if (songError) throw songError

        goto(resolve("/song/[slug]", { slug }))
      } catch (e) {
        toast.error((e as Error).message)
      }
    },
  })

  const sheetErrors = $derived(form.errors.sheet?.trim())
  const keyErrors = $derived(form.errors.key?.trim())
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
