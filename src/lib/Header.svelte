<script lang="ts">
  import MoreVertIcon from "@iconify-svelte/material-symbols/more-vert"
  import { DropdownMenu } from "bits-ui"

  import { resolve } from "$app/paths"
  import { page } from "$app/state"

  const session = $derived(page.data.session)

  const items = $derived([
    { label: "About", link: resolve("/about") },
    ...(session ? [{ label: "Dashboard", link: resolve("/dashboard") }] : []),
    ...(!session ? [{ label: "Login", link: resolve("/login") }] : []),
  ])
</script>

<header>
  <h1><a href={resolve("/")}>WorshipMate</a></h1>
  <nav class="expanded">
    <ul>
      {#each items as { label, link }, i (i)}
        <li><a href={link}>{label}</a></li>
      {/each}
    </ul>
  </nav>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <MoreVertIcon height="2.5em" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content class="nav-dropdown-menu" align="end" sideOffset={-10}>
        {#each items as { label, link }, i (i)}
          <DropdownMenu.Item>
            <a href={link}>{label}</a>
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
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

  nav.expanded ul,
  :global(.nav-dropdown-menu) {
    display: flex;
    gap: 2rem;

    font-family: var(--font-alegreya-sc);
    text-transform: lowercase;
    font-size: 1.5rem;
    a {
      font-weight: 400;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
    }
  }

  :global([data-dropdown-menu-trigger]) {
    display: none;
    background: none;
    border: none;
    color: var(--white);

    /* Icon has unwanted right padding */
    :global(svg) {
      position: relative;
      right: -20px;
    }
  }

  :global(.nav-dropdown-menu[data-dropdown-menu-content]) {
    background: #eee;
    box-shadow: 0 0 8px var(--black);

    flex-direction: column;
    gap: 0;

    text-align: right;

    :global([data-dropdown-menu-item]) {
      padding: 0.5rem 1rem;

      &:not(:last-child) {
        border-bottom: 1px solid var(--primary);
      }
    }
  }

  /***** Mobile *****/

  :global(body.mobile) {
    header h1 {
      font-size: 2.5rem;
    }

    nav.expanded {
      display: none;
    }
    :global([data-dropdown-menu-trigger]) {
      display: initial;
    }
  }
</style>
