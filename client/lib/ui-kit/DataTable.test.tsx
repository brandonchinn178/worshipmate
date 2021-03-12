import { screen } from '@testing-library/react'

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

  const { container } = renderUI(
    <DataTable data={mockData} columnDefs={columnDefs} />,
  )

  expect(container).toMatchSnapshot()
  expect(screen.getByText('Id')).toBeVisible()
  expect(screen.getByText('Name')).toBeVisible()
  expect(screen.getByText('1')).toBeVisible()
  expect(screen.getByText('Alice')).toBeVisible()
  expect(screen.getByText('2')).toBeVisible()
  expect(screen.getByText('Bob')).toBeVisible()
  expect(screen.getByText('3')).toBeVisible()
  expect(screen.getByText('Charlie')).toBeVisible()
})

it('displays no data', () => {
  const columnDefs = [{ name: 'id' }, { name: 'name' }]

  const { container } = renderUI(
    <DataTable data={[]} columnDefs={columnDefs} />,
  )

  expect(container).toMatchSnapshot()
  expect(screen.getByText('Id')).toBeVisible()
  expect(screen.getByText('Name')).toBeVisible()
})

it('displays a different header', () => {
  const columnDefs = [{ name: 'name', header: 'First Name' }]

  renderUI(<DataTable data={mockData} columnDefs={columnDefs} />)

  expect(screen.getByText('First Name')).toBeVisible()
  expect(screen.queryByText('Name')).toBeNull()
})

it('displays column with a custom render function', () => {
  const columnDefs = [
    {
      name: 'id+name',
      render: ({ id, name }: MockPerson) => `${id}+${name}`,
    },
  ]

  renderUI(<DataTable data={mockData} columnDefs={columnDefs} />)

  expect(screen.getByText('1+Alice')).toBeVisible()
})
