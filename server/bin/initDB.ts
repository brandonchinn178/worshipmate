#!/usr/bin/env ts-node-script

import { Database } from 'pg-fusion'

import { withDatabase } from '~/db'
import { ArtistRecord, SongRecord } from '~/song/schema'

export const prepopulateDB = async (db: Database) => {
  const [
    artistAllSonsAndDaughters,
    artistBethel,
    artistHousefires,
    artistMattRedman,
    artistMaverickCity,
  ] = await db.insertAll<ArtistRecord>(
    'artist',
    [
      {
        slug: 'all-sons-and-daughters',
        name: 'All Songs and Daughters',
      },
      {
        slug: 'bethel-music',
        name: 'Bethel Music',
      },
      {
        slug: 'housefires',
        name: 'Housefires',
      },
      {
        slug: 'matt-redman',
        name: 'Matt Redman',
      },
      {
        slug: 'maverick-city-music',
        name: 'Maverick City Music',
      },
    ],
    {
      onConflict: {
        action: 'update',
        column: 'slug',
      },
    },
  )

  await db.insertAll<SongRecord>(
    'song',
    [
      {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: artistMattRedman.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      },
      {
        slug: 'build-my-life',
        title: 'Build My Life',
        artist: artistHousefires.id,
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
      {
        slug: 'ever-be',
        title: 'Ever Be',
        artist: artistBethel.id,
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
      {
        slug: 'jireh',
        title: 'Jireh',
        artist: artistMaverickCity.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 76,
      },
      {
        slug: 'great-are-you-lord',
        title: 'Great Are You Lord',
        artist: artistAllSonsAndDaughters.id,
        recommended_key: 'G',
        time_signature_top: 6,
        time_signature_bottom: 8,
        bpm: 52,
      },
      {
        slug: 'man-of-your-word',
        title: 'Man of Your Word',
        artist: artistMaverickCity.id,
        recommended_key: 'G',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
    ],
    {
      onConflict: {
        action: 'update',
        column: 'slug',
      },
    },
  )
}

const initDB = async (db: Database) => {
  await prepopulateDB(db)
  console.log('Prepopulated database')
}

if (require.main === module) {
  withDatabase(initDB).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
