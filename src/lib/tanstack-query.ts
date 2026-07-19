import { MutationCache, QueryCache, QueryClient } from "@tanstack/svelte-query"
import { toast } from "svelte-sonner"

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    },
  }),
})
