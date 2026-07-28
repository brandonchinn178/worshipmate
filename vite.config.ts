import adapter from "@sveltejs/adapter-static"
import { sveltekit } from "@sveltejs/kit/vite"
import { svelteTesting } from "@testing-library/svelte/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },

      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter(),

      alias: {
        $testlib: "./src/__test__",
      },
    }),
    svelteTesting(),
  ],
  ssr: {
    noExternal: ["svelte-sonner"],
  },
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          environment: "jsdom",
          include: ["src/**/*.spec.ts"],
          setupFiles: ["src/__test__/setup.ts"],
          mockReset: true,
        },
        resolve: {
          conditions: ["browser"],
        },
      },
    ],
  },
})
