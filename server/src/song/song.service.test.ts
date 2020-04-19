import { getRepository } from 'typeorm'

import { setupConnection } from '~test-utils'

import { Song } from './song.entity'
import { SongService } from './song.service'

setupConnection()

it('can search all songs', async () => {
  const repo = getRepository(Song)
  await repo.insert([
    {
      slug: 'test-song',
      title: 'Test Song',
      recommendedKey: 'E',
      timeSignature: {
        top: 4,
        bottom: 4,
      },
      bpm: 120,
    },
    {
      slug: 'test-song-2',
      title: 'Test Song 2',
      recommendedKey: 'E',
      timeSignature: {
        top: 4,
        bottom: 4,
      },
      bpm: 120,
    },
    {
      slug: 'another-song',
      title: 'Another Song',
      recommendedKey: 'E',
      timeSignature: {
        top: 4,
        bottom: 4,
      },
      bpm: 120,
    },
  ])

  const service = new SongService(repo)

  expect(await service.searchSongs()).toEqual([
    expect.objectContaining({ title: 'Test Song' }),
    expect.objectContaining({ title: 'Test Song 2' }),
    expect.objectContaining({ title: 'Another Song' }),
  ])

  expect(await service.searchSongs('test')).toEqual([
    expect.objectContaining({ title: 'Test Song' }),
    expect.objectContaining({ title: 'Test Song 2' }),
  ])

  expect(await service.searchSongs('another')).toEqual([
    expect.objectContaining({ title: 'Another Song' }),
  ])

  expect(await service.searchSongs('song')).toEqual([
    expect.objectContaining({ title: 'Test Song' }),
    expect.objectContaining({ title: 'Test Song 2' }),
    expect.objectContaining({ title: 'Another Song' }),
  ])
})
