import "$src/app.css"

import type { Component } from "svelte"
import * as browser from "vitest-browser-svelte"
import type { ComponentImport, ComponentOptions, SetupOptions } from "vitest-browser-svelte/pure"

import AppProviders from "$lib/AppProviders.svelte"

type BrowserRenderResult<C extends Component, W extends Component> = ReturnType<
  typeof browser.render<C, W>
>
type Wrapper = typeof AppProviders &
  // Workaround for browser.render requiring W to extend Component<{}>
  Component<Record<string, unknown>>
export type RenderResult<C extends Component> = BrowserRenderResult<C, Wrapper>

export const render = <C extends Component>(
  component: ComponentImport<C>,
  options: ComponentOptions<C> = {},
  renderOptions: SetupOptions<Wrapper> = {},
): RenderResult<C> => {
  return browser.render(component, options, {
    wrapper: AppProviders,
    ...renderOptions,
  })
}
