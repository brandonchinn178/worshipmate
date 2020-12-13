import * as fc from 'fast-check'
import * as _ from 'lodash'

import {
  BpmFilter,
  RecommendedKeyFilter,
  ThemeFilter,
  TimeSignatureFilter,
} from './songFilter'

const fcNonEmptyString = fc
  .string()
  .map(_.trim)
  .filter((s) => s.length > 0)
const fcNonString = fc.anything().filter((v) => typeof v !== 'string')

const fcPositiveInt = fc.integer({ min: 1 })
const fcNonPositiveInt = fc.oneof(
  fc.anything().filter((v) => typeof v !== 'number'),
  fc.double().filter((x) => !Number.isInteger(x)),
  fc.integer({ max: 0 }),
)

const fcNonArray = fc.anything().filter((v) => !Array.isArray(v))

describe('RecommendedKeyFilter', () => {
  describe('validate', () => {
    it('validates valid RECOMMENDED_KEY', () => {
      fc.assert(
        fc.property(fcNonEmptyString, (value) => {
          expect(RecommendedKeyFilter.validate(value)).toBe(value)
        }),
      )
    })

    it('fails for empty strings', () => {
      expect(RecommendedKeyFilter.validate('')).toBeNull()
    })

    it('fails for non-strings', () => {
      fc.assert(
        fc.property(fcNonString, (value) => {
          expect(RecommendedKeyFilter.validate(value)).toBeNull()
        }),
      )
    })
  })

  describe('display', () => {
    it('shows a RECOMMENDED_KEY', () => {
      expect(RecommendedKeyFilter.display('E')).toBe('E')
    })
  })
})

describe('BpmFilter', () => {
  describe('validate', () => {
    it('validates valid BPM', () => {
      fc.assert(
        fc.property(fcPositiveInt, (value) => {
          expect(BpmFilter.validate(value)).toBe(value)
        }),
      )
    })

    it('validates valid BPM as a string', () => {
      fc.assert(
        fc.property(fcPositiveInt, (value) => {
          expect(BpmFilter.validate(value.toString())).toBe(value)
        }),
      )
    })

    it('fails for anything other than positive integers', () => {
      const fcNonPositiveIntLike = fcNonPositiveInt.filter(
        (v) => !(typeof v === 'string' && !isNaN(parseInt(v, 10))),
      )

      fc.assert(
        fc.property(fcNonPositiveIntLike, (value) => {
          expect(BpmFilter.validate(value)).toBeNull()
        }),
      )
    })
  })

  describe('display', () => {
    it('shows a BPM', () => {
      expect(BpmFilter.display(100)).toBe('100')
    })
  })
})

describe('TimeSignatureFilter', () => {
  describe('validate', () => {
    it('validates valid TIME_SIGNATURE', () => {
      fc.assert(
        fc.property(fc.tuple(fcPositiveInt, fcPositiveInt), (value) => {
          expect(TimeSignatureFilter.validate(value)).toStrictEqual(value)
        }),
      )
    })

    it('validates valid TIME_SIGNATURE as a string', () => {
      expect(TimeSignatureFilter.validate('3/4')).toStrictEqual([3, 4])
    })

    it('fails for arrays not containing exactly two elements', () => {
      fc.assert(
        fc.property(
          fc.array(fcPositiveInt).filter((arr) => arr.length !== 2),
          (value) => {
            expect(TimeSignatureFilter.validate(value)).toBeNull()
          },
        ),
      )
    })

    it('fails for arrays containing anything other than positive integers', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.tuple(fcPositiveInt, fcNonPositiveInt),
            fc.tuple(fcNonPositiveInt, fcPositiveInt),
            fc.tuple(fcNonPositiveInt, fcNonPositiveInt),
          ),
          (value) => {
            expect(TimeSignatureFilter.validate(value)).toBeNull()
          },
        ),
      )
    })

    it('fails for non-arrays', () => {
      const fcNonTimeSigLike = fcNonArray.filter(
        (v) => !(typeof v === 'string' && v.match(/^\d+\/\d+$/)),
      )

      fc.assert(
        fc.property(fcNonTimeSigLike, (value) => {
          expect(TimeSignatureFilter.validate(value)).toBeNull()
        }),
      )
    })
  })

  describe('display', () => {
    it('shows a TIME_SIGNATURE', () => {
      expect(TimeSignatureFilter.display([3, 4])).toBe('3/4')
    })
  })
})

describe('ThemeFilter', () => {
  describe('validate', () => {
    it('validates valid THEME', () => {
      fc.assert(
        fc.property(fcNonEmptyString, (value) => {
          expect(ThemeFilter.validate(value)).toBe(value)
        }),
      )
    })

    it('fails for empty strings', () => {
      expect(ThemeFilter.validate('')).toBeNull()
    })

    it('fails for non-strings', () => {
      fc.assert(
        fc.property(fcNonString, (value) => {
          expect(ThemeFilter.validate(value)).toBeNull()
        }),
      )
    })
  })

  describe('display', () => {
    it('shows a THEME', () => {
      expect(ThemeFilter.display('Praise')).toBe('Praise')
    })
  })
})
