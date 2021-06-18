import * as _ from 'lodash'
import { Key, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { color, font } from '~/theme'

export type DataTableProps<T> = {
  // The data to render in the DataTable
  data: readonly T[]
  // The definitions for the columns in the DataTable
  columnDefs: ColumnDefs<T>

  // The key to use for each row (default: the index of the row)
  rowKey?: (rowData: T) => Key
}

export type ColumnDefs<T> = Array<ColumnDef<T>>

type ColumnDef<T> = {
  // The name of the column
  name: string
  // The name of the column to display in the header row (default: `name` capitalized)
  header?: string
  // The size of the column (default: 1fr)
  size?: string
  // A custom rendering function, if desired
  render?: (rowData: T) => ReactNode
}

const renderHeader = <T,>({ name, header }: ColumnDef<T>): ReactNode => {
  if (header !== undefined) {
    return header
  }

  return _.capitalize(name)
}

const renderCell = <T,>(
  { name, render }: ColumnDef<T>,
  rowData: T,
): ReactNode => {
  if (render) {
    return render(rowData)
  }

  return _.get(rowData, name)
}

export function DataTable<T>({ data, columnDefs, rowKey }: DataTableProps<T>) {
  // Let columns shrink to dictated proportions, without respect to
  // the data in the columns.
  // https://github.com/rachelandrew/cssgrid-ama/issues/25
  const columnSizes = columnDefs
    .map(({ size }) => size || 'minmax(0, 1fr)')
    .join(' ')

  const getCellKey = (rowData: T, i: number, j: number) => {
    const row = rowKey ? rowKey(rowData) : i
    const col = j
    return `${row}-${col}`
  }

  return (
    <Table columnSizes={columnSizes}>
      <>
        {columnDefs.map((columnDef, i) => (
          <TableHeaderCell key={i}>{renderHeader(columnDef)}</TableHeaderCell>
        ))}
      </>
      {data.map((rowData, i) =>
        columnDefs.map((columnDef, j) => (
          <TableCell key={getCellKey(rowData, i, j)}>
            {renderCell(columnDef, rowData)}
          </TableCell>
        )),
      )}
    </Table>
  )
}

const borderStyle = css`1px solid ${color('black')}`

const Table = styled.div<{ columnSizes: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.columnSizes};

  border: ${borderStyle};
  border-bottom: 0;
  & > * {
    border-bottom: ${borderStyle};
  }
`

const TableCell = styled.div`
  display: grid;
  padding: 10px;
  justify-items: center;
  text-align: center;
  min-width: max-content;
`

const TableHeaderCell = styled(TableCell)`
  padding: 5px;
  ${font('label')}
  font-size: 1.4rem;
  text-align: center;
`
