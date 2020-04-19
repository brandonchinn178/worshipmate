import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepository } from 'typeorm'

import { AppModule } from '~/app.module'
import { request } from '~test-utils'

import { Song } from './song.entity'

const insertMockSongs = async () => {
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
}

describe('SongResolver', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get all songs', async () => {
    await insertMockSongs()

    const { songs } = await request(app, {
      query: /* GraphQL */ `
        query {
          songs {
            id
            title
            slug
          }
        }
      `,
    })

    expect(songs).toStrictEqual([
      {
        id: '1',
        title: 'Test Song',
        slug: 'test-song',
      },
      {
        id: '2',
        title: 'Test Song 2',
        slug: 'test-song-2',
      },
      {
        id: '3',
        title: 'Another Song',
        slug: 'another-song',
      },
    ])
  })

  it('should get all songs matching a search query', async () => {
    await insertMockSongs()

    const { songs } = await request(app, {
      query: /* GraphQL */ `
        query {
          songs(query: "another") {
            id
            title
            slug
          }
        }
      `,
    })

    expect(songs).toStrictEqual([
      {
        id: '3',
        title: 'Another Song',
        slug: 'another-song',
      },
    ])
  })
})
