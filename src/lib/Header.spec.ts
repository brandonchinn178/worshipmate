import { screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"

import { render } from "$testlib/render"

import Header from "./Header.svelte"

describe("Header", () => {
  it("renders", async () => {
    render(Header)
    expect(await screen.findByRole("heading", { name: "WorshipMate" })).toBeVisible()
  })
})
