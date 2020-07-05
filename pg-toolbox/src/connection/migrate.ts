import { RunnerOption as NodePgMigrateOptions } from 'node-pg-migrate'

export type MigrateOptions = Partial<NodePgMigrateOptions> & {
  /**
   * If true, load arguments from process.argv as well. Useful for migration
   * scripts. Supports the following commands:
   *
   *   - up
   *   - up {N}
   *   - down
   *   - down {N}
   *   - redo
   *   - redo {N}
   */
  loadFromArgs?: boolean
}

export type MigrateDirection = 'up' | 'down'

export type MigrateDirectionOptions = Array<{
  direction: MigrateDirection
  count: number
}>

const parseMigrateCount = (arg: string | undefined) => {
  if (arg === undefined) {
    return Infinity
  }

  const count = parseInt(arg, 10)
  if (isNaN(count)) {
    throw new Error(`Invalid number: ${count}`)
  }

  return count
}

const parseMigrateDirections = (command: string): MigrateDirection[] => {
  switch (command) {
    case 'up':
      return ['up']
    case 'down':
      return ['down']
    case 'redo':
      return ['down', 'up']
    default: {
      throw new Error(`Unknown migrate command: ${command}`)
    }
  }
}

/**
 * Should be called with process.argv.
 */
export const parseMigrateArgs = (argv: string[]): MigrateDirectionOptions => {
  // [node executable, script path, ...args]
  const args = argv.slice(2)

  if (args[0] === undefined) {
    throw new Error('No migrate command specified')
  }

  const directions = parseMigrateDirections(args[0])

  const count = parseMigrateCount(args[1])

  return directions.map((direction) => ({ direction, count }))
}
