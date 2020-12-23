import { renderUI } from '~jest-utils'

import { DataTable } from './DataTable'

type MockPerson = {
  id: number
  name: string
}

const mockData: MockPerson[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]

it('displays data', () => {
  const columnDefs = [{ name: 'id' }, { name: 'name' }]

  const { container, getByText } = renderUI(
    <DataTable data={mockData} columnDefs={columnDefs} />,
  )

  expect(container).toMatchSnapshot()
  expect(getByText('Id')).toBeVisible()
  expect(getByText('Name')).toBeVisible()
  expect(getByText('1')).toBeVisible()
  expect(getByText('Alice')).toBeVisible()
  expect(getByText('2')).toBeVisible()
  expect(getByText('Bob')).toBeVisible()
  expect(getByText('3')).toBeVisible()
  expect(getByText('Charlie')).toBeVisible()
})

it('displays no data', () => {
  const columnDefs = [{ name: 'id' }, { name: 'name' }]

  const { container, getByText } = renderUI(
    <DataTable data={[]} columnDefs={columnDefs} />,
  )

  expect(container).toMatchSnapshot()
  expect(getByText('Id')).toBeVisible()
  expect(getByText('Name')).toBeVisible()
})

it('displays a different header', () => {
  const columnDefs = [{ name: 'name', header: 'First Name' }]

  const { getByText, queryByText } = renderUI(
    <DataTable data={mockData} columnDefs={columnDefs} />,
  )

  expect(getByText('First Name')).toBeVisible()
  expect(queryByText('Name')).toBeNull()
})

it('displays column with a custom render function', () => {
  const columnDefs = [
    {
      name: 'id+name',
      render: ({ id, name }: MockPerson) => `${id}+${name}`,
    },
  ]

  const { getByText } = renderUI(
    <DataTable data={mockData} columnDefs={columnDefs} />,
  )

  expect(getByText('1+Alice')).toBeVisible()
})
