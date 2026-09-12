<script lang="ts">
  import { AuthError } from "@supabase/supabase-js"
  import { toast } from "svelte-sonner"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import { page } from "$app/state"
  import { login } from "$lib/auth.svelte"
  import Spinner from "$lib/Spinner.svelte"

  const session = $derived(page.data.session)
  $effect(() => {
    if (session !== null) {
      goto(resolve("/"))
    }
  })

  let loginPending = $state(false)
  let input = $state({
    email: "",
    password: "",
  })
</script>

<main>
  <form
    onsubmit={async (e) => {
      e.preventDefault()
      loginPending = true
      try {
        await login(input)
      } catch (e) {
        toast.error(e instanceof AuthError ? e.message : `${e}`)
      } finally {
        loginPending = false
      }
    }}
  >
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" bind:value={input.email} />
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" bind:value={input.password} />
    </div>
    <div class="submit">
      {#if loginPending}
        <Spinner height="2em" />
      {:else}
        <button>Login</button>
      {/if}
    </div>
  </form>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  form {
    display: grid;
    padding: 2rem 3rem;
    gap: 1rem;
    border: 1px solid var(--black);
    width: 500px;

    .field {
      display: flex;
      flex-direction: column;
    }
  }

  label {
    font-family: var(--font-alegreya-sc);
    text-transform: lowercase;
  }

  .submit {
    display: flex;
    justify-content: center;
  }
</style>
