import * as fc from 'fast-check'

import { parseMigrateArgs } from './migrate'

const mockConsoleLog = jest.spyOn(console, 'log')

const mockProcessExit = jest.spyOn(process, 'exit')

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

describe('parseMigrateArgs', () => {
  it('parses up/down commands', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.constantFrom('up', 'down'),
        fc.integer(),
        (argv0, argv1, direction, count) => {
          expect(
            parseMigrateArgs([argv0, argv1, direction, count.toString()]),
          ).toStrictEqual([{ direction, count }])
        },
      ),
    )
  })

  it('parses the redo command', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.integer(),
        (argv0, argv1, count) => {
          expect(
            parseMigrateArgs([argv0, argv1, 'redo', count.toString()]),
          ).toStrictEqual([
            { direction: 'down', count },
            { direction: 'up', count },
          ])
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
          const migrateDirectionOptions = parseMigrateArgs([
            argv0,
            argv1,
            command,
          ])
          for (const options of migrateDirectionOptions) {
            expect(options.count).toBe(Infinity)
          }
        },
      ),
    )
  })

  it('fails without a command', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (argv0, argv1) => {
        expect(() => parseMigrateArgs([argv0, argv1])).toThrow()
        expect(mockConsoleLog).toHaveBeenCalled()
        expect(mockProcessExit).toHaveBeenCalled()
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
          expect(() => parseMigrateArgs([argv0, argv1, command])).toThrow()
          expect(mockConsoleLog).toHaveBeenCalled()
          expect(mockProcessExit).toHaveBeenCalled()
        },
      ),
    )
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
