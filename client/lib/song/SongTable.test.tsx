import { screen } from '@testing-library/react'

import { renderUI } from '~jest-utils'

import { SongTable } from './SongTable'

const songs = [
  {
    slug: 'amazing-grace',
    title: 'Amazing Grace',
    artist: 'John Newton',
    themes: ['Grace', 'Comfort'],
    recommendedKey: 'E',
    timeSignature: [4, 4] as [number, number],
    bpm: 64,
  },
]

it('displays a song', () => {
  renderUI(<SongTable songs={songs} />)
  expect(screen.getByText('Amazing Grace')).toBeVisible()
})

describe('edit link', () => {
  it('shows when isAdmin', () => {
    renderUI(<SongTable songs={songs} isAdmin={true} />)

    expect(screen.getByTestId('icon-edit')).toBeVisible()
  })

  it('not shown when not isAdmin', () => {
    renderUI(<SongTable songs={songs} isAdmin={false} />)

    expect(screen.queryByTestId('icon-edit')).toBeNull()
  })
})
