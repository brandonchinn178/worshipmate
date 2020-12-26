import { sql, SqlQuery } from '../sql'

export type InsertOptions = {
  onConflict?: ConflictOptions | null
}

export const mkInsertQueries = <T extends Record<string, unknown>>(
  table: string,
  records: T[],
  options: InsertOptions = {},
) => {
  const { onConflict = null } = options

  return records.map((record) => {
    const columnNames = Object.keys(record)
    const values = columnNames.map((columnName) => record[columnName])

    const columnNamesSql = sql.join(columnNames.map(sql.quote), ',')
    const valuesSql = sql.join(values.map(sql.param), ',')

    const conflictClause = mkConflictClause(
      columnNamesSql,
      valuesSql,
      onConflict,
    )

    return sql`
      INSERT INTO ${sql.quote(table)} (${columnNamesSql})
      VALUES (${valuesSql})
      ${conflictClause}
    `
  })
}

type ConflictTarget = { column: string } | { constraint: string }

type ConflictOptions =
  | 'ignore'
  | ({ action: 'ignore' } & Partial<ConflictTarget>)
  | ({ action: 'update' } & ConflictTarget)

const mkConflictClause = (
  columnNamesSql: SqlQuery,
  valuesSql: SqlQuery,
  options: ConflictOptions | null,
) => {
  if (options === null) {
    return sql``
  }

  const { action, ...target } =
    options === 'ignore' ? { action: 'ignore' } : options

  const targetClause =
    'constraint' in target && target.constraint
      ? sql`ON CONSTRAINT ${sql.quote(target.constraint)}`
      : 'column' in target && target.column
      ? sql`(${sql.quote(target.column)})`
      : sql``

  switch (action) {
    case 'ignore':
      return sql`ON CONFLICT ${targetClause} DO NOTHING`
    case 'update':
      return sql`
        ON CONFLICT ${targetClause} DO UPDATE
        SET (${columnNamesSql}) = (${valuesSql})
      `
  }
}
