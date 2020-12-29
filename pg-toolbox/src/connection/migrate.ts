import { RunnerOptionConfig as NodePgMigrateOptions } from 'node-pg-migrate/dist/types'

export type MigrateAction = 'up' | 'down' | 'redo'

export type MigrateOptions = Partial<
  Omit<NodePgMigrateOptions, 'direction'> & {
    action?: 'up' | 'down' | 'redo'
  }
>

const getUsage = (scriptName: string) => `
Usage: ${scriptName} [up|down|redo] [COUNT]

Migrate the database with the given arguments.

Parameters:
  up|down|redo      The direction to migrate, with redo doing down first,
                    then up.

  COUNT             The number of migrations to run
`

const parseMigrateAction = (arg: string | undefined): MigrateAction | null => {
  switch (arg) {
    case 'up':
      return 'up'
    case 'down':
      return 'down'
    case 'redo':
      return 'redo'
    default:
      return null
  }
}

const parseMigrateCount = (arg: string | undefined): number | null => {
  if (arg === undefined) {
    return Infinity
  }

  const count = parseInt(arg, 10)
  if (isNaN(count)) {
    return null
  }

  return count
}

/**
 * Load `MigrateOptions` from command line arguments.
 */
export const loadCLIMigrateArgs = (
  argv: string[] = process.argv,
): MigrateOptions => {
  // [node executable, script path, ...args]
  const [scriptName, ...args] = argv.slice(1)

  const action = parseMigrateAction(args[0])
  if (action === null) {
    const usage = getUsage(scriptName)
    console.log(usage)

    switch (args[0]) {
      case '--help':
      case 'help':
        process.exit(0)
        break
      default:
        process.exit(1)
    }
  }

  const count = parseMigrateCount(args[1])
  if (count === null) {
    throw new Error(`Invalid number: ${count}`)
  }

  return { action, count }
}
