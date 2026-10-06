import type { MergeDeep } from "type-fest"

import type { Database as DatabaseOld } from "./_generated"

export * from "./_generated"

// https://github.com/orgs/supabase/discussions/50597
export type Database = MergeDeep<
  DatabaseOld,
  {
    public: {
      Views: {
        songs_search: { Row: SongsSearchView }
      }
      Functions: {
        search_songs: { Returns: SongsSearchView[] }
      }
    }
  }
>

type SongsSearchViewOld = DatabaseOld["public"]["Views"]["songs_search"]["Row"]
type SongsSearchView = {
  [K in keyof SongsSearchViewOld]: K extends
    "id" | "slug" | "title" | "artist" | "key" | "sheet" | "lyrics"
    ? NonNullable<SongsSearchViewOld[K]>
    : SongsSearchViewOld[K]
}
