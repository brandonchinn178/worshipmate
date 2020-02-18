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
    <SongFilter filters={testFilters} activeFilters={{}} />,
  )

  expect(getByText('Recommended Key')).toBeVisible()
  expect(getByText('C (1)')).toBeVisible()
  expect(getByText('G (2)')).toBeVisible()
  expect(getByText('E (3)')).toBeVisible()
  expect(getByText('Time Signature')).toBeVisible()
  expect(getByText('4/4 (6)')).toBeVisible()
})

it('renders active options differently', () => {
  const { container: before } = renderUI(
    <SongFilter filters={testFilters} activeFilters={{}} />,
  )

  const { container: after } = renderUI(
    <SongFilter
      filters={testFilters}
      activeFilters={{ recommendedKey: 'G' }}
    />,
  )

  expect(before).toMatchDiffSnapshot(after)
})
