import * as fc from 'fast-check'
import * as _ from 'lodash'

import { FilterName } from '~/graphql/types'

import { validateSearchFilter } from './searchFilter'

const mockSongFilter = {
  validate: jest.fn(),
}

jest.mock('./songFilter', () => {
  return {
    ...(jest.requireActual('./songFilter') as Record<string, unknown>),
    getSongFilter: () => mockSongFilter,
  }
})

beforeEach(jest.resetAllMocks)

describe('validateSearchFilter', () => {
  it('errors for any filter name not registered in GraphQL', () => {
    const fcNonFilterName = fc.string().filter((s) => !(s in FilterName))

    fc.assert(
      fc.property(fcNonFilterName, fc.array(fc.anything()), (name, oneof) => {
        expect(() => {
          validateSearchFilter({ name, oneof })
        }).toThrow()
      }),
    )
  })

  it('errors with all invalid values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(FilterName)),
        fc.set(fc.string(), { minLength: 1 }).chain(
          (values) => fc.tuple(
            fc.constant(values),
            fc.shuffledSubarray(values, { minLength: 1 })
          )
        ),
        (name, [allValues, invalidValues]) => {
          jest.resetAllMocks()
          mockSongFilter.validate.mockImplementation(
            (v) => _.includes(invalidValues, v) ? null : v
          )

          expect(() => {
            validateSearchFilter({ name, oneof: allValues })
          }).toThrow()
          // TODO: check error message
        }
      ),
    )
  })

  // TODO: check valid search filter
})
