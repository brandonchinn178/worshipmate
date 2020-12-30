#!/usr/bin/env ts-node-script

// eslint-disable-next-line @typescript-eslint/no-var-requires
const concurrently = require('concurrently')

const startAll = async () => {
  const isTest = process.env.NODE_ENV === 'test'
  const startCommand = isTest ? 'start:test' : 'start:dev'

  const services = [
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
    isTest && {
      command: 'yarn server db:start-test-server',
      name: 'db-test-server',
      prefixColor: 'cyan',
    },
  ]

  await concurrently(services.filter(Boolean), {
    killOthers: ['success', 'failure'],
    inputStream: process.stdin,
  })
}

startAll()
  .catch(() => {
    process.exit(1)
  })
  .finally(() => {
    // https://github.com/kimmobrunfeldt/concurrently/pull/253
    process.stdin.pause()
  })
