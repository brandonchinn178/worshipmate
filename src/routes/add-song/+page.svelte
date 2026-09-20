<script lang="ts">
  import * as Form from "$lib/form"
  import { parseKey, parseSongSheet } from "$lib/songsheet/parser"
  import SongSheetViewer from "$lib/songsheet/SongSheetViewer.svelte"

  const formId = $props.id()
  let form = Form.init({
    id: formId,
    values: {
      title: "",
      artist: "",
      key: "",
      sheet: "",
    },
  })

  const onSubmit = async () => {
    console.log("TODO: submit", form.values)
  }

  let parsedSheet = $derived.by(() => {
    try {
      return { result: parseSongSheet(form.values.sheet), error: null }
    } catch (e) {
      return { result: null, error: (e as Error).message }
    }
  })

  let parsedKey = $derived.by(() => {
    if (form.values.key === "") {
      return {
        result: null,
        error: form.values.sheet !== "" && parsedSheet.result !== null ? "Key is missing" : null,
      }
    }
    try {
      return { result: parseKey(form.values.key), error: null }
    } catch (e) {
      return { result: null, error: `Failed to parse key: ${(e as Error).message}` }
    }
  })
</script>

<main>
  <Form.Form {onSubmit}>
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
  {#if parsedSheet.result && parsedKey.result}
    <div>
      <SongSheetViewer sheet={parsedSheet.result} key={parsedKey.result} />
    </div>
  {:else if parsedSheet.error || parsedKey.error}
    <div class="song-sheet-error">
      <pre>Unable to render song sheet:</pre>
      {#if parsedSheet.error}
        <pre>{parsedSheet.error}</pre>
      {/if}
      {#if parsedKey.error}
        <pre>{parsedKey.error}</pre>
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
