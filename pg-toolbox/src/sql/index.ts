import {
  isSqlQuery,
  mkSqlQuery,
  paramSqlQuery,
  rawSqlQuery,
  SqlQuery,
} from './query'
import { mergeLists } from './utils'

export type { SqlQuery }

/**
 * A template function for building SQL queries.
 *
 * Usage:
 *
 *   db.query(sql`SELECT * FROM song WHERE song.name = ${name}`)
 */
export const sql = (
  texts: TemplateStringsArray,
  ...values: unknown[]
): SqlQuery => {
  const textQueries = texts.map(rawSqlQuery)
  const valuesQueries = values.map((value) =>
    isSqlQuery(value) ? value : paramSqlQuery(value),
  )

  const queries = mergeLists(textQueries, valuesQueries)

  return sql.join(queries)
}

/**
 * Interpolate the given value as a SQL parameter.
 *
 * Usage:
 *
 *   const valuesSql = values.map(sql.param)
 *   db.query(sql`
 *     INSERT INTO song (name)
 *     VALUES (${sql.join(valuesSql, ',')})
 *   `)
 */
sql.param = paramSqlQuery

/**
 * Interpolate the given SQL directly, without escaping parameters.
 *
 * Usage:
 *
 *   db.query(sql`
 *     INSERT INTO song (name, create_time)
 *     VALUES (${name}, ${sql.raw('NOW()')})
 *   `)
 */
sql.raw = rawSqlQuery

/**
 * A helper for quoting an identifier.
 *
 * Usage:
 *
 *   db.query(sql`SELECT * FROM ${sql.quote(tableName)}`)
 */
sql.quote = (identifier: string) => sql.raw(`"${identifier}"`)

/**
 * A helper for joining multiple SQL queries.
 *
 * Usage:
 *
 *   db.query(sql`
 *     SELECT * FROM song WHERE ${sql.join([
 *       sql`song.name = ${name}`,
 *       sql`song.artist = ${artist}`
 *     ], ' AND ')}
 *   `)
 */
sql.join = (queries: SqlQuery[], delimiter = '') =>
  mkSqlQuery(
    queries.reduce((acc, { values }) => acc.concat(values), [] as unknown[]),
    (nextParamID) => {
      let paramID = nextParamID
      const builtText: string[] = []

      queries.forEach(({ buildText, values }) => {
        builtText.push(buildText(paramID))
        paramID += values.length
      })

      return builtText.join(delimiter)
    },
  )
