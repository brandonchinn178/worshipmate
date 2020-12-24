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

const MIGRATE_DIRECTIONS: Record<string, MigrateDirection[]> = {
  up: ['up'],
  down: ['down'],
  redo: ['down', 'up'],
}

/**
 * Should be called with process.argv.
 */
export const parseMigrateArgs = (argv: string[]): MigrateDirectionOptions => {
  // [node executable, script path, ...args]
  const [scriptName, ...args] = argv.slice(1)

  const directions = MIGRATE_DIRECTIONS[args[0]]
  if (directions === undefined) {
    const usage = `
      Usage: ${scriptName} [up|down|redo] [COUNT]

      Migrate the database with the given arguments.

      Parameters:
        up|down|redo      The direction to migrate, with redo doing down first,
                          then up.

        COUNT             The number of migrations to run
    `
    console.log(usage.trim().replace(/^[ ]{6}/gm, ''))
    process.exit(args[0] === '--help' || args[0] === 'help' ? 0 : 1)
  }

  const count = parseMigrateCount(args[1])

  return directions.map((direction) => ({ direction, count }))
}
