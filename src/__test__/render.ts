import * as testingLibrary from "@testing-library/svelte"
import { type Queries, type RenderOptions } from "@testing-library/svelte"
import { type ComponentImport, type ComponentOptions } from "@testing-library/svelte-core/types"
import type { Component } from "svelte"

import AppProviders from "$lib/AppProviders.svelte"

export type RenderResult<C extends Component, Q extends Queries> = testingLibrary.RenderResult<
  C,
  Q,
  typeof AppProviders
>

export const render = <C extends Component, Q extends Queries = Queries>(
  component: ComponentImport<C>,
  options: ComponentOptions<C> = {},
  renderOptions: RenderOptions<Q, typeof AppProviders> = {},
): RenderResult<C, Q> => {
  return testingLibrary.render(component, options, {
    wrapper: AppProviders,
    ...renderOptions,
  })
}
