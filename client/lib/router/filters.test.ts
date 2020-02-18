import {
  ActiveFilters,
  addFilter,
  decodeFilters,
  encodeFilters,
  loadFilters,
  removeFilter,
} from './filters'
import { getNewQuery, mkRouter } from './testutils'

it('encodes and decodes filters', () => {
  const filters: ActiveFilters = { key: 'E' }

  expect(decodeFilters(encodeFilters(filters))).toEqual(filters)
})

it('checks invalid characters when encoding', () => {
  expect(() => encodeFilters({ bad: 'a=b' })).toThrow()
  expect(() => encodeFilters({ bad: 'a;b' })).toThrow()
  expect(() => encodeFilters({ 'a=b': 'bad' })).toThrow()
  expect(() => encodeFilters({ 'a;b': 'bad' })).toThrow()
})

it('decodes empty filters', () => {
  expect(decodeFilters(undefined)).toEqual({})
  expect(decodeFilters(null)).toEqual({})
  expect(decodeFilters('')).toEqual({})
  expect(decodeFilters([''])).toEqual({})
})

it('loads filters from query object', () => {
  expect(loadFilters({})).toEqual({})
  expect(loadFilters({ filters: 'a=b' })).toEqual({ a: 'b' })
  expect(loadFilters({ filters: ['a=b'] })).toEqual({ a: 'b' })
})

it('adds a filter', () => {
  const router = mkRouter({
    query: {
      filters: encodeFilters({ key: 'E' }),
    },
  })

  addFilter(router, 'bpm', '80')

  expect(getNewQuery(router)).toEqual({
    filters: encodeFilters({
      key: 'E',
      bpm: '80',
    }),
  })
})

it('changes a filter', () => {
  const router = mkRouter({
    query: {
      filters: encodeFilters({ key: 'E' }),
    },
  })

  addFilter(router, 'key', 'G')

  expect(getNewQuery(router)).toEqual({
    filters: encodeFilters({
      key: 'G',
    }),
  })
})

it('removes a filter', () => {
  const router = mkRouter({
    query: {
      filters: encodeFilters({ key: 'E', bpm: '80' }),
    },
  })

  removeFilter(router, 'bpm')

  expect(getNewQuery(router)).toEqual({
    filters: encodeFilters({
      key: 'E',
    }),
  })
})
