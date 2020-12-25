#!/usr/bin/env ts-node-script

// eslint-disable-next-line @typescript-eslint/no-var-requires
const concurrently = require('concurrently')

const startAll = async () => {
  await concurrently([
    { command: 'yarn server migrate:dev', name: 'initdb', prefixColor: 'cyan' },
  ])

  await concurrently(
    [
      { command: 'yarn server start', name: 'server', prefixColor: 'blue' },
      { command: 'yarn client dev', name: 'client', prefixColor: 'green' },
    ],
    {
      killOthers: ['success', 'failure'],
      inputStream: process.stdin,
    },
  )
}

startAll()
  .catch(console.error)
  .finally(() => {
    process.stdin.pause()
  })
