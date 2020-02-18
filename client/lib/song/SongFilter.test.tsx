import { fireEvent, wait } from '@testing-library/react'

import { renderUI } from '~jest-utils'

import SongFilter from './SongFilter'

const testFilters = [
  {
    key: 'recommendedKey',
    options: [
      {
        name: 'C',
        count: 1,
      },
      {
        name: 'G',
        count: 2,
      },
      {
        name: 'E',
        count: 3,
      },
    ],
  },
  {
    key: 'timeSignature',
    options: [
      {
        name: '4/4',
        count: 6,
      },
    ],
  },
]

it('renders filters', () => {
  const { getByText } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{}}
      addFilter={jest.fn()}
      removeFilter={jest.fn()}
    />,
  )

  expect(getByText('Recommended Key')).toBeVisible()
  expect(getByText('C (1)')).toBeVisible()
  expect(getByText('G (2)')).toBeVisible()
  expect(getByText('E (3)')).toBeVisible()
  expect(getByText('Time Signature')).toBeVisible()
  expect(getByText('4/4 (6)')).toBeVisible()
})

it('can add a filter', async () => {
  const mockAddFilter = jest.fn()

  const { getByText } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{}}
      addFilter={mockAddFilter}
      removeFilter={jest.fn()}
    />,
  )

  fireEvent.click(getByText('G (2)'))

  await wait(() => expect(mockAddFilter).toHaveBeenCalled())
  expect(mockAddFilter.mock.calls[0]).toEqual(['recommendedKey', 'G'])
})

it('can change a filter', async () => {
  const mockAddFilter = jest.fn()

  const { getByText } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      addFilter={mockAddFilter}
      removeFilter={jest.fn()}
    />,
  )

  fireEvent.click(getByText('E (3)'))

  await wait(() => expect(mockAddFilter).toHaveBeenCalled())
  expect(mockAddFilter.mock.calls[0]).toEqual(['recommendedKey', 'E'])
})

it('can remove a filter', async () => {
  const mockRemoveFilter = jest.fn()

  const { getByText } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      addFilter={jest.fn()}
      removeFilter={mockRemoveFilter}
    />,
  )

  fireEvent.click(getByText('G (2)'))

  await wait(() => expect(mockRemoveFilter).toHaveBeenCalled())
  expect(mockRemoveFilter.mock.calls[0]).toEqual(['recommendedKey'])
})

it('renders active options differently', () => {
  const { container: before } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{}}
      addFilter={jest.fn()}
      removeFilter={jest.fn()}
    />,
  )

  const { container: after } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      addFilter={jest.fn()}
      removeFilter={jest.fn()}
    />,
  )

  expect(before).toMatchDiffSnapshot(after)
})
