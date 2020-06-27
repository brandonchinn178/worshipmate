import * as fc from 'fast-check'

import { mergeLists } from './utils'

describe('mergeLists', () => {
  const MAX_ARRAY_LENGTH = 15

  const fcArray = (length?: number) => {
    if (length !== undefined) {
      return fc.array(fc.anything(), length, length)
    } else {
      return fc.array(fc.anything())
    }
  }

  test('mergeLists([], arr) == arr', () => {
    fc.assert(
      fc.property(fcArray(), (arr) => {
        expect(mergeLists([], arr)).toStrictEqual(arr)
      }),
    )
  })

  test('mergeLists(arr, []) == arr', () => {
    fc.assert(
      fc.property(fcArray(), (arr) => {
        expect(mergeLists(arr, [])).toStrictEqual(arr)
      }),
    )
  })

  const unmerge = <T>(arr: T[]): [T[], T[]] => {
    return [
      arr.filter((_, i) => i % 2 === 0),
      arr.filter((_, i) => i % 2 !== 0),
    ]
  }

  it('merges two lists of the same length', () => {
    fc.assert(
      fc.property(
        fc
          .nat(MAX_ARRAY_LENGTH)
          .chain((len) => fc.tuple(fcArray(len), fcArray(len))),
        ([arr1, arr2]) => {
          const result = mergeLists(arr1, arr2)
          const [result1, result2] = unmerge(result)
          expect(result1).toStrictEqual(arr1)
          expect(result2).toStrictEqual(arr2)
        },
      ),
    )
  })

  /**
   * [ (i, j)
   * | i <- [1..MAX_ARRAY_LENGTH]
   * , j <- [1..MAX_ARRAY_LENGTH]
   * , i != j
   * ]
   */
  const lengthPairs = []
  for (let i = 1; i <= MAX_ARRAY_LENGTH; i++) {
    for (let j = 1; j <= MAX_ARRAY_LENGTH; j++) {
      if (i === j) {
        continue
      }
      lengthPairs.push([i, j])
    }
  }

  const fcDiffLenArrays = fc.constantFrom(...lengthPairs).chain(([i, j]) => {
    const [lo, hi] = i < j ? [i, j] : [j, i]
    return fc.tuple(fcArray(lo), fcArray(hi))
  })

  it('merges lists of different lengths', () => {
    fc.assert(
      fc.property(
        fcDiffLenArrays,
        fc.boolean(),
        ([short, long], shortFirst) => {
          const result = shortFirst
            ? mergeLists(short, long)
            : mergeLists(long, short)

          // index from which point on only contains elements from 'long'
          const boundary = short.length * 2

          const resultWithBoth = result.slice(0, boundary)
          const [result1, result2] = unmerge(resultWithBoth)
          const resultWithRest = result.slice(boundary)

          if (shortFirst) {
            expect(result1).toStrictEqual(short)
            expect([...result2, ...resultWithRest]).toStrictEqual(long)
          } else {
            expect([...result1, ...resultWithRest]).toStrictEqual(long)
            expect(result2).toStrictEqual(short)
          }
        },
      ),
    )
  })
})
