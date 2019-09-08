import _ from 'lodash'
import { Key, ReactNode } from 'react'
import styled, { css } from 'styled-components'

type DataTableProps<T> = {
  // The data to render in the DataTable
  data: T[]
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
  if (header) {
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

  if (typeof rowData === 'object') {
    // TODO: fix?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rowData as any)[name]
  }

  return null
}

export default function DataTable<T>({
  data,
  columnDefs,
  rowKey,
}: DataTableProps<T>) {
  // Let columns shrink to dictated proportions, without respect to
  // the data in the columns.
  // https://github.com/rachelandrew/cssgrid-ama/issues/25
  const columnSizes = columnDefs
    .map(({ size }) => size || 'minmax(0, 1fr)')
    .join(' ')

  const getRowKey = (rowData: T, i: number) => (rowKey ? rowKey(rowData) : i)

  return (
    <Table>
      <TableRow columnSizes={columnSizes}>
        {columnDefs.map((columnDef, i) => (
          <TableHeaderCell key={i}>{renderHeader(columnDef)}</TableHeaderCell>
        ))}
      </TableRow>
      {data.map((rowData, i) => (
        <TableRow key={getRowKey(rowData, i)} columnSizes={columnSizes}>
          {columnDefs.map((columnDef, j) => (
            <TableCell key={j}>{renderCell(columnDef, rowData)}</TableCell>
          ))}
        </TableRow>
      ))}
    </Table>
  )
}

const borderStyle = css`1px solid ${(p) => p.theme.colors.black}`

const Table = styled.div`
  display: grid;
  border-top: ${borderStyle};
  border-left: ${borderStyle};
`

const TableRow = styled.div<{ columnSizes: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.columnSizes};
  border-right: ${borderStyle};
  border-bottom: ${borderStyle};
`

const TableCell = styled.div`
  display: grid;
  padding: 5px 10px;
`

const TableHeaderCell = styled(TableCell)`
  ${(p) => p.theme.fonts.label};
  font-size: 1.2rem;
  text-align: center;
`
