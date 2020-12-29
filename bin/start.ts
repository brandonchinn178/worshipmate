#!/usr/bin/env ts-node-script

// eslint-disable-next-line @typescript-eslint/no-var-requires
const concurrently = require('concurrently')

const startAll = async () => {
  await concurrently([
    { command: 'yarn server migrate:dev', name: 'initdb', prefixColor: 'cyan' },
  ])

  await concurrently(
    [
      { command: 'yarn server start:dev', name: 'server', prefixColor: 'blue' },
      {
        command: 'yarn client start:dev',
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
