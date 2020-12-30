#!/usr/bin/env ts-node-script

// eslint-disable-next-line @typescript-eslint/no-var-requires
const concurrently = require('concurrently')

const startAll = async () => {
  const startCommand =
    process.env.NODE_ENV === 'test' ? 'start:test' : 'start:dev'

  await concurrently(
    [
      {
        command: `yarn server ${startCommand}`,
        name: 'server',
        prefixColor: 'blue',
      },
      {
        command: `yarn client ${startCommand}`,
        name: 'client',
        prefixColor: 'green',
      },
    ],
    {
      killOthers: ['success', 'failure'],
      inputStream: process.stdin,
    },
  )
}

startAll()
  .catch(() => {
    process.exit(1)
  })
  .finally(() => {
    // https://github.com/kimmobrunfeldt/concurrently/pull/253
    process.stdin.pause()
  })
