// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from "@supabase/supabase-js"

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      header?: boolean
      session: Session | null
      title?: string
      description?: string
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
