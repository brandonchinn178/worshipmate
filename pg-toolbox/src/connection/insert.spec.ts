import '~/testutils'

import { extendExpect } from '~test-utils'

import { mkInsertQueries } from './insert'

extendExpect()

describe('mkInsertQueries', () => {
  it('works for multiple records', async () => {
    const songs = [
      { name: 'Take On Me', artist: 'A-ha', rating: 5 },
      { name: 'Separate Ways', artist: 'Journey' },
    ]

    expect(mkInsertQueries('song', songs)).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","artist","rating")
          VALUES ($1,$2,$3)
        `,
        values: ['Take On Me', 'A-ha', 5],
      }),
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","artist")
          VALUES ($1,$2)
        `,
        values: ['Separate Ways', 'Journey'],
      }),
    ])
  })

  it('defaults to onConflict=null', async () => {
    const songs = [{ name: 'Take On Me' }]

    expect(mkInsertQueries('song', songs)).toEqualJSON(
      mkInsertQueries('song', songs, { onConflict: null }),
    )
  })

  it('implements onConflict=ignore', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(mkInsertQueries('song', songs, { onConflict: 'ignore' })).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","rating") VALUES ($1,$2)
          ON CONFLICT DO NOTHING
        `,
        values: ['Take On Me', 5],
      }),
    ])
  })

  test('onConflict=ignore is equivalent to onConflict={ action: ignore }', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(
      mkInsertQueries('song', songs, { onConflict: 'ignore' }),
    ).toEqualJSON(
      mkInsertQueries('song', songs, { onConflict: { action: 'ignore' } }),
    )
  })

  it('implements onConflict=ignore with column', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(
      mkInsertQueries('song', songs, {
        onConflict: { action: 'ignore', column: 'name' },
      }),
    ).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","rating") VALUES ($1,$2)
          ON CONFLICT ("name") DO NOTHING
        `,
        values: ['Take On Me', 5],
      }),
    ])
  })

  it('implements onConflict=ignore with constraint', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(
      mkInsertQueries('song', songs, {
        onConflict: { action: 'ignore', constraint: 'unique_name' },
      }),
    ).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","rating") VALUES ($1,$2)
          ON CONFLICT ON CONSTRAINT "unique_name" DO NOTHING
        `,
        values: ['Take On Me', 5],
      }),
    ])
  })

  it('implements onConflict=update with column', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(
      mkInsertQueries('song', songs, {
        onConflict: { action: 'update', column: 'name' },
      }),
    ).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","rating") VALUES ($1,$2)
          ON CONFLICT ("name") DO UPDATE SET ("name","rating") = ($3,$4)
        `,
        values: ['Take On Me', 5, 'Take On Me', 5],
      }),
    ])
  })

  it('implements onConflict=update with constraint', async () => {
    const songs = [{ name: 'Take On Me', rating: 5 }]

    expect(
      mkInsertQueries('song', songs, {
        onConflict: { action: 'update', constraint: 'unique_name' },
      }),
    ).toEqual([
      expect.sqlMatching({
        text: `
          INSERT INTO "song" ("name","rating") VALUES ($1,$2)
          ON CONFLICT ON CONSTRAINT "unique_name" DO UPDATE SET ("name","rating") = ($3,$4)
        `,
        values: ['Take On Me', 5, 'Take On Me', 5],
      }),
    ])
  })
})
