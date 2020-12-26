import { sql } from '../sql'

export const mkInsertQueries = <T extends Record<string, unknown>>(
  table: string,
  records: T[],
) => {
  return records.map((record) => {
    const columnNames = Object.keys(record)
    const values = columnNames.map((columnName) => record[columnName])

    const columnNamesSql = sql.join(columnNames.map(sql.quote), ',')
    const valuesSql = sql.join(values.map(sql.param), ',')

    return sql`
      INSERT INTO ${sql.quote(table)} (${columnNamesSql})
      VALUES (${valuesSql})
    `
  })
}
