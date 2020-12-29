import * as fc from 'fast-check'

import { loadCLIMigrateArgs } from './migrate'

const mockConsoleLog = jest.spyOn(console, 'log')

const mockProcessExit = (jest.spyOn(process, 'exit') as unknown) as jest.Mock

beforeEach(() => {
  jest.resetAllMocks()
  mockConsoleLog.mockImplementation(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  })
  mockProcessExit.mockImplementation(() => {
    throw new Error()
  })
})

afterEach(jest.resetAllMocks)

describe('loadCLIMigrateArgs', () => {
  it('parses an action and a count', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.constantFrom('up', 'down', 'redo'),
        fc.integer(),
        (argv0, argv1, action, count) => {
          expect(
            loadCLIMigrateArgs([argv0, argv1, action, count.toString()]),
          ).toStrictEqual({ action, count })
        },
      ),
    )
  })

  it('returns Infinity with no count specified', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.constantFrom('up', 'down', 'redo'),
        (argv0, argv1, command) => {
          const { count } = loadCLIMigrateArgs([argv0, argv1, command])
          expect(count).toBe(Infinity)
        },
      ),
    )
  })

  it('fails without a command', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (argv0, argv1) => {
        expect(() => loadCLIMigrateArgs([argv0, argv1])).toThrow()
      }),
    )
  })

  it('fails with an unrecognized command', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.string().filter((s) => !['up', 'down', 'redo'].includes(s)),
        (argv0, argv1, command) => {
          expect(() => loadCLIMigrateArgs([argv0, argv1, command])).toThrow()
        },
      ),
    )
  })

  it('prints a help message', () => {
    expect(() => {
      loadCLIMigrateArgs(['node', 'scripts/migrate.js', '--help'])
    }).toThrow()

    expect(mockConsoleLog).toHaveBeenCalled()
    const [usage] = mockConsoleLog.mock.calls[0]
    expect(usage).toMatchSnapshot()
  })

  it('fails with a non-numeric count', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.constantFrom('up', 'down', 'redo'),
        fc.string().filter((s) => isNaN(parseInt(s, 10))),
        (argv0, argv1, command, count) => {
          expect(() => {
            loadCLIMigrateArgs([argv0, argv1, command, count])
          }).toThrow()
        },
      ),
    )
  })
})
