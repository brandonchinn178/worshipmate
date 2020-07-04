type SqlQueryMatcher = {
  text: string
  values: unknown[]
}

/**
 * A Jest test helper for checking if a SQL query matches the given query,
 * ignoring differences in whitespace.
 *
 * Usage:
 *
 *   const name = 'Take On Me'
 *   const query = sql`
 *     INSERT INTO "song" ("name")
 *     VALUES (${name})
 *   `
 *
 *   expect(query).toEqual(
 *     sqlMatches({
 *       text: 'INSERT INTO "song" ("name") VALUES ($1)',
 *       values: [name],
 *     })
 *   )
 */
export const sqlMatches = (query: string | SqlQueryMatcher) => {
  const { text, values } =
    typeof query === 'string' ? { text: query, values: [] } : query

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  const escapedText = text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

  // ignore differences in whitespace
  const textMatch = escapedText.trim().replace(/\s+/g, '\\s+')

  return expect.objectContaining({
    text: expect.stringMatching(new RegExp(textMatch)),
    values,
  })
}
