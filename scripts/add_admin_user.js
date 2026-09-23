import { execFileSync } from "node:child_process"
import { exit } from "node:process"

import { createClient } from "@supabase/supabase-js"

const main = async () => {
  const conf = JSON.parse(
    execFileSync("npx", ["supabase", "status", "-o", "json"], {
      stdio: "pipe",
    }),
  )

  const supabase = createClient(conf.API_URL, conf.SERVICE_ROLE_KEY)

  const [email, password] = process.argv.slice(2)

  const userCreate = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (userCreate.error) {
    throw new Error(`Failed to create ${email}: ${userCreate.error.message}`)
  }

  const profileInsert = await supabase.from("profiles").insert({
    id: userCreate.data.user.id,
    is_admin: true,
  })
  if (profileInsert.error) {
    throw new Error(`Failed to set up profile for ${email}: ${profileInsert.error.message}`)
  }
}

try {
  await main()
} catch (e) {
  console.error(e.message)
  exit(1)
}
