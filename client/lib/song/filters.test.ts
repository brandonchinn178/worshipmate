import * as fc from 'fast-check'

import { getNewQuery, mkRouter } from '~/router/testutils'

import { getFilterType, loadActiveFilters, mkFilterHandler } from './filters'

describe('Filter types', () => {
  describe('recommendedKey', () => {
    const { parseFilterValue, showFilterValue } = getFilterType(
      'recommendedKey',
    )

    test('parse is the inverse of show', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          expect(parseFilterValue(showFilterValue(s))).toBe(s)
        }),
      )
    })

    test('show is the inverse of parse', () => {
      fc.assert(
        fc.property(fc.string(), (s) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(showFilterValue(parseFilterValue(s)!)).toBe(s)
        }),
      )
    })
  })

  describe('bpm', () => {
    const { parseFilterValue, showFilterValue } = getFilterType('bpm')

    test('parse is the inverse of show', () => {
      fc.assert(
        fc.property(fc.integer(), (bpm) => {
          expect(parseFilterValue(showFilterValue(bpm))).toBe(bpm)
        }),
      )
    })

    test('show is the inverse of parse', () => {
      fc.assert(
        fc.property(fc.integer(), (bpm) => {
          const s = bpm.toString()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(showFilterValue(parseFilterValue(s)!)).toBe(s)
        }),
      )
    })

    it('errors when parsing a non-number', () => {
      expect(parseFilterValue('asdf')).toBeNull()
    })
  })

  describe('timeSignature', () => {
    const { parseFilterValue, showFilterValue } = getFilterType('timeSignature')

    it('parses a time signature correctly', () => {
      expect(parseFilterValue('3/4')).toStrictEqual([3, 4])
    })

    it('shows a time signature correctly', () => {
      expect(showFilterValue([3, 4])).toBe('3/4')
    })

    test('parse is the inverse of show', () => {
      fc.assert(
        fc.property(fc.tuple(fc.nat(), fc.nat()), (timeSig) => {
          expect(parseFilterValue(showFilterValue(timeSig))).toStrictEqual(
            timeSig,
          )
        }),
      )
    })

    test('show is the inverse of parse', () => {
      fc.assert(
        fc.property(fc.nat(), fc.nat(), (top, bottom) => {
          const s = `${top}/${bottom}`
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(showFilterValue(parseFilterValue(s)!)).toBe(s)
        }),
      )
    })

    it('errors when parsing a string in the wrong format', () => {
      expect(parseFilterValue('asdf')).toBeNull()
      expect(parseFilterValue('1/2/3')).toBeNull()
      expect(parseFilterValue('1/-10')).toBeNull()
    })
  })
})

describe('loadActiveFilters', () => {
  it('deserializes filters from querystring', () => {
    const router = mkRouter({
      query: {
        recommendedKey: 'E',
        bpm: '72',
        timeSignature: '4/4',
      },
    })
    expect(loadActiveFilters(router)).toStrictEqual({
      recommendedKey: 'E',
      bpm: 72,
      timeSignature: [4, 4],
    })
  })

  it('ignores invalid filter values', () => {
    const router = mkRouter({
      query: {
        recommendedKey: 'E',
        bpm: 'foo',
      },
    })
    expect(loadActiveFilters(router)).toStrictEqual({
      recommendedKey: 'E',
    })
  })
})

describe('mkFilterHandler', () => {
  describe('addFilter', () => {
    it('adds a new filter', () => {
      const router = mkRouter()
      const filterHandler = mkFilterHandler(router)

      filterHandler.addFilter('bpm', 72)

      expect(getNewQuery(router)).toStrictEqual({
        bpm: '72',
      })
    })

    it('overwrites an existing filter', () => {
      const router = mkRouter({
        query: { bpm: '72' },
      })
      const filterHandler = mkFilterHandler(router)

      filterHandler.addFilter('bpm', 100)

      expect(getNewQuery(router)).toStrictEqual({
        bpm: '100',
      })
    })

    it('adds a filter in addition to another filter', () => {
      const router = mkRouter({
        query: { recommendedKey: 'E' },
      })
      const filterHandler = mkFilterHandler(router)

      filterHandler.addFilter('bpm', 72)

      expect(getNewQuery(router)).toStrictEqual({
        recommendedKey: 'E',
        bpm: '72',
      })
    })
  })

  describe('removeFilter', () => {
    it('removes a filter', () => {
      const router = mkRouter({
        query: {
          recommendedKey: 'E',
          bpm: '72',
        },
      })
      const filterHandler = mkFilterHandler(router)

      filterHandler.removeFilter('bpm')

      expect(getNewQuery(router)).toStrictEqual({
        recommendedKey: 'E',
      })
    })
  })
})
