<script lang="ts">
  import SearchIcon from "@iconify-svelte/material-symbols/search"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import { page } from "$app/state"
  import { session } from "$lib/auth.svelte"
  import { listSongs } from "$lib/song"
  import Spinner from "$lib/Spinner.svelte"
  import { pluralize } from "$lib/utils/pluralize"

  const search = page.url.searchParams.get("search")

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

  const songsQuery = listSongs()
  const songs = $derived(songsQuery.data ?? [])
</script>

<main>
  {#if songsQuery.isPending}
    <div class="loading">
      <Spinner height="50px" />
    </div>
  {:else}
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
            <td>{song.key}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  main {
    max-width: 50rem;
    margin: 0 auto;

    display: grid;
    gap: 0.5rem;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .searchbar {
    display: grid;
    grid-template-columns: auto min-content;
    gap: 0.5rem;

    input {
      height: 100%;
      padding: 0.25rem;
      font-size: 1.2rem;
    }

    button {
      padding: 2px 6px 0;
    }

    input,
    button {
      border: 1px solid var(--black);
      background: var(--white);
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
