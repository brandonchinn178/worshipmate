<script lang="ts">
  import SearchIcon from "@iconify-svelte/material-symbols/search"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import { page } from "$app/state"
  import { renderChord } from "$lib/songsheet/chord"
  import { pluralize } from "$lib/utils/pluralize"

  const search = page.url.searchParams.get("search")

  const { session } = page.data
  let { data } = $props()
  let songs = $derived(data.songs)

  // Searchbar
  let searchInput = $state(search ?? "")
  const setSearch = (e: Event) => {
    e.preventDefault()
    const url = new URL(page.url)
    url.searchParams.set("search", searchInput)
    goto(resolve(`/?${url.searchParams}`))
  }

  // TODO: activate filters
  let activeFilters: Array<{ key: string }> = $state([])
</script>

<main>
  <form class="searchbar" onsubmit={setSearch}>
    <input bind:value={searchInput} />
    <button>
      <SearchIcon width="20px" />
    </button>
  </form>
  <div class="table-meta">
    <p class="song-count">{songs.length} {pluralize("song", songs.length)}</p>
    {#each activeFilters as filter (filter.key)}
      <p>TODO</p>
    {/each}
    <button>Add filter</button>
    {#if session !== null}
      <p><a href="#todo">Add song</a></p>
    {/if}
  </div>
  <table>
    <tbody>
      <tr>
        <th>Title</th>
        <th>Artist</th>
        <th>Key</th>
      </tr>
      {#each songs as song (song.slug)}
        <tr>
          <td><a href={resolve("/song/[slug]", { slug: song.slug })}>{song.title}</a></td>
          <td>{song.artist}</td>
          <td>{renderChord(song.key)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  main {
    max-width: 50rem;
    margin: 0 auto;

    display: grid;
    gap: 0.5rem;
  }

  .searchbar {
    display: grid;
    grid-template-columns: auto min-content;
    gap: 0.5rem;

    button {
      padding: 2px 5px 0;
      font-size: 0;
    }
  }

  .table-meta {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    .song-count {
      font-weight: bold;
    }
  }

  table {
    th {
      font-weight: normal;
      font-family: var(--font-alegreya-sc);
      text-transform: lowercase;
      font-size: 1.5rem;
    }
    th,
    td {
      text-align: center;
      padding: 0.25rem;
    }

    /* Borders */
    --border: 1px solid var(--black);
    border: var(--border);
    th,
    td {
      border-top: var(--border);
    }
  }
</style>
