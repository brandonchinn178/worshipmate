export interface SqlQuery {
  $type: symbol
  text: string
  values: unknown[]

  // Starting at the given number for parameter substitution, build the query
  // text. The 'text' field should be equivalent to `buildText(1)`
  buildText: (nextParamID: number) => string
}

const $sqlQuerySymbol = Symbol('SqlQuery')

export const isSqlQuery = (value: unknown): value is SqlQuery =>
  !!value && (value as SqlQuery).$type === $sqlQuerySymbol

export const mkSqlQuery = (
  values: unknown[],
  buildText: (nextParamID: number) => string,
): SqlQuery => ({
  $type: $sqlQuerySymbol,
  get text() {
    return this.buildText(1)
  },
  values,
  buildText,
})

export const rawSqlQuery = (text: string): SqlQuery =>
  mkSqlQuery([], () => text)

export const paramSqlQuery = (value: unknown): SqlQuery =>
  mkSqlQuery([value], (nextParamID) => '$' + nextParamID.toString())
