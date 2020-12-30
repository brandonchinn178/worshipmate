const { spawnSync } = require('child_process')
const path = require('path')

const TOP = path.resolve(process.cwd(), '..')

const yarn = (...args) => {
  const { error } = spawnSync('yarn', args, {
    cwd: TOP,
  })

  if (error) {
    throw error
  }
}

module.exports = (on) => {
  process.env.NODE_ENV = 'test'

  on('task', {
    clearDatabase() {
      yarn('server', 'db:clear')
      return null
    },
    seedDatabase() {
      yarn('server', 'db:init')
      return null
    },
  })
}
