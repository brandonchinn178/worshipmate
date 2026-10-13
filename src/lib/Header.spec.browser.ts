import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"

import { render } from "$testlib/render"

import Header from "./Header.svelte"

describe("Header", () => {
  it("renders", async () => {
    await render(Header)
    await expect.element(page.getByRole("heading", { name: "WorshipMate" })).toBeVisible()
  })
})
