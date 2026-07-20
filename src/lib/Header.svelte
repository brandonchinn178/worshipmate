<script>
  import { resolve } from "$app/paths"
  import { createSessionQuery } from "$lib/auth.svelte"

  const { data: session } = createSessionQuery()
</script>

<header>
  <h1><a href={resolve("/")}>WorshipMate</a></h1>
  <nav>
    <ul>
      <li><a href={resolve("/about")}>About</a></li>
      {#if session !== null}
        <li><a href={resolve("/dashboard")}>Dashboard</a></li>
      {/if}
      {#if session === null}
        <li><a href={resolve("/login")}>Login</a></li>
      {/if}
    </ul>
  </nav>
</header>

<style>
  header {
    display: grid;
    grid-template-columns: min-content auto;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--primary);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.75);

    color: var(--white);
    a {
      color: inherit;
    }
  }

  h1 {
    --shadow: 2px 2px 2px rgba(0, 0, 0, 0.9);

    display: inline-block;

    font-family: var(--font-alegreya-sc);
    font-size: 3rem;
    text-shadow: var(--shadow);

    a {
      padding: 0.25rem 0.5rem;
      border: 3px solid var(--white);
      box-shadow: var(--shadow);

      &:hover {
        color: var(--white);
      }
    }
  }

  nav ul {
    display: grid;
    grid-auto-flow: column;
    gap: 2rem;

    font-family: var(--font-alegreya-sc);
    text-transform: lowercase;
    font-size: 1.5rem;
    a {
      font-weight: 400;
    }
  }
</style>
