import { MutationCache, QueryCache, QueryClient } from "@tanstack/svelte-query"

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // TODO: toast on error
      console.error(`Query error [${query.queryKey}]:`, error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // TODO: toast on error
      console.error(`Mutation error [${mutation.options.mutationKey ?? "unknown"}]:`, error)
    },
  }),
})
