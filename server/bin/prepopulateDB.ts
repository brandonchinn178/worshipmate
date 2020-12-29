#!/usr/bin/env ts-node-script

import { Database } from 'pg-fusion'

import { withDatabase } from '~/db'

const prepopulateDB = async (db: Database) => {
  await db.insertAll(
    'song',
    [
      {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      },
      {
        slug: 'build-my-life',
        title: 'Build My Life',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
      {
        slug: 'ever-be',
        title: 'Ever Be',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
      {
        slug: 'great-are-you-lord',
        title: 'Great Are You Lord',
        recommended_key: 'G',
        time_signature_top: 6,
        time_signature_bottom: 8,
        bpm: 52,
      },
    ],
    {
      onConflict: {
        action: 'update',
        column: 'slug',
      },
    },
  )

  console.log('Prepopulated songs table')
}

withDatabase(prepopulateDB).catch((e) => {
  console.error(e)
  process.exit(1)
})
