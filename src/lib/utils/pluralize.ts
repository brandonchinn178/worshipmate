/**
 * Pluralize the given string.
 *
 * @example
 * pluralize("song", 2) // "songs"
 * pluralize ("person", "people", 2) // "people"
 */
export const pluralize = (...args: [string, number] | [string, string, number]) => {
  const [singular, plural, count] = args.length === 2 ? [args[0], args[0] + "s", args[1]] : args

  switch (count) {
    case 0:
      return plural
    case 1:
      return singular
    default:
      return plural
  }
}
