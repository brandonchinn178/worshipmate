<script lang="ts">
  import { createLoginMutation } from "$lib/auth.svelte"
  import Spinner from "$lib/Spinner.svelte"

  let input = $state({
    email: "",
    password: "",
  })

  const loginMutation = createLoginMutation()
</script>

<main>
  <form
    onsubmit={async (e) => {
      e.preventDefault()
      await loginMutation.mutateAsync(input)
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
      {#if loginMutation.isPending}
        <Spinner height="2em" />
      {:else}
        <button> Login </button>
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
