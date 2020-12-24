import { fireEvent, waitFor } from '@testing-library/react'

import { renderUI } from '~jest-utils'

import { SongFilterPanel } from './SongFilterPanel'

const testFilters = {
  recommendedKey: [
    {
      value: 'C',
      valueDisplay: 'C',
      count: 1,
    },
    {
      value: 'G',
      valueDisplay: 'G',
      count: 2,
    },
    {
      value: 'E',
      valueDisplay: 'E',
      count: 3,
    },
  ],
  bpm: [
    {
      value: 100,
      valueDisplay: '100',
      count: 6,
    },
  ],
  timeSignature: [
    {
      value: [4, 4] as [number, number],
      valueDisplay: '4/4',
      count: 6,
    },
  ],
}

const mockFilterHandler = {
  addFilter: jest.fn(),
  removeFilter: jest.fn(),
}

beforeEach(jest.resetAllMocks)

it('renders filters', () => {
  const { getByText } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{}}
      filterHandler={mockFilterHandler}
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
  const { getByText } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{}}
      filterHandler={mockFilterHandler}
    />,
  )

  fireEvent.click(getByText('G (2)'))

  const mockAddFilter = mockFilterHandler.addFilter
  await waitFor(() => expect(mockAddFilter).toHaveBeenCalled())
  expect(mockAddFilter.mock.calls[0]).toEqual(['recommendedKey', 'G'])
})

it('can change a filter', async () => {
  const { getByText } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      filterHandler={mockFilterHandler}
    />,
  )

  fireEvent.click(getByText('E (3)'))

  const mockAddFilter = mockFilterHandler.addFilter
  await waitFor(() => expect(mockAddFilter).toHaveBeenCalled())
  expect(mockAddFilter.mock.calls[0]).toEqual(['recommendedKey', 'E'])
})

it('can remove a filter', async () => {
  const { getByText } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      filterHandler={mockFilterHandler}
    />,
  )

  fireEvent.click(getByText('G (2)'))

  const mockRemoveFilter = mockFilterHandler.removeFilter
  await waitFor(() => expect(mockRemoveFilter).toHaveBeenCalled())
  expect(mockRemoveFilter.mock.calls[0]).toEqual(['recommendedKey'])
})

it('renders active options differently', () => {
  const { container: before } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{}}
      filterHandler={mockFilterHandler}
    />,
  )

  const { container: after } = renderUI(
    <SongFilterPanel
      availableFilters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
      filterHandler={mockFilterHandler}
    />,
  )

  expect(before).toMatchDiffSnapshot(after)
})
