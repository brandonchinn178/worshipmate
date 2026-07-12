/** @type {import("prettier").Config} */
const config = {
  useTabs: false,
  singleQuote: false,
  trailingComma: "all",
  semi: false,
  printWidth: 100,
  plugins: ["prettier-plugin-svelte"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
}

export default config
