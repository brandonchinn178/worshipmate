import { renderUI } from '~jest-utils'

import SongTable from './SongTable'

it('displays a song', () => {
  const { getByText } = renderUI(
    <SongTable
      songs={[
        {
          slug: 'amazing-grace',
          title: 'Amazing Grace',
          artist: 'John Newton',
          themes: ['Grace', 'Comfort'],
        },
      ]}
    />,
  )

  expect(getByText('Amazing Grace')).toBeVisible()
})
