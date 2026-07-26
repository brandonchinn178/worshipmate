import type { QueryClient } from "@tanstack/svelte-query"
import * as testingLibrary from "@testing-library/svelte"
import { type Queries, type RenderOptions } from "@testing-library/svelte"
import { type ComponentImport, type ComponentOptions } from "@testing-library/svelte-core/types"
import type { Component } from "svelte"

import AppProviders from "$lib/AppProviders.svelte"
import { createTestQueryClient } from "$testlib/tanstack-query"

export type RenderResult<C extends Component, Q extends Queries> = testingLibrary.RenderResult<
  C,
  Q,
  typeof AppProviders
> & {
  queryClient: QueryClient
}

export const render = <C extends Component, Q extends Queries = Queries>(
  component: ComponentImport<C>,
  options: ComponentOptions<C> = {},
  renderOptions: RenderOptions<Q, typeof AppProviders> = {},
): RenderResult<C, Q> => {
  const queryClient = createTestQueryClient()
  const result = testingLibrary.render(component, options, {
    wrapper: AppProviders,
    wrapperProps: { queryClient },
    ...renderOptions,
  })
  return { ...result, queryClient }
}
