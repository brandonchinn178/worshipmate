<script lang="ts">
  import { AuthError } from "@supabase/supabase-js"
  import { toast } from "svelte-sonner"

  import { goto } from "$app/navigation"
  import { resolve } from "$app/paths"
  import { page } from "$app/state"
  import { login, type LoginInput } from "$lib/auth.svelte"
  import * as Form from "$lib/form"

  const session = $derived(page.data.session)
  $effect(() => {
    if (session !== null) {
      goto(resolve("/"))
    }
  })

  const formId = $props.id()
  const form = Form.init<LoginInput>({
    id: formId,
    fields: {
      email: { initial: "", required: true },
      password: { initial: "", required: true },
    },
    onSubmit: async (values) => {
      try {
        await login(values)
      } catch (e) {
        toast.error(e instanceof AuthError ? e.message : `${e}`)
      }
    },
  })
</script>

<main>
  <div class="container">
    <Form.Form>
      <Form.Field name="email" label="Email">
        <input {...form.field("email")} />
      </Form.Field>
      <Form.Field name="password" label="Password">
        <input {...form.field("password")} type="password" />
      </Form.Field>
      <Form.SubmitButton label="Login" />
    </Form.Form>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  .container {
    padding: 2rem 3rem;
    border: 1px solid var(--black);
    width: 500px;
  }
</style>
