import * as fc from 'fast-check'

import { getSearchCondition } from './sql'

describe('getSearchCondition', () => {
  it('returns TRUE with no options', () => {
    expect(getSearchCondition({})).toMatchSql('TRUE')
  })

  it('filters by title', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (query) => {
        expect(getSearchCondition({ query })).toMatchSql({
          text: `
            "song"."title" ILIKE $1
          `,
          values: [`%${query}%`],
        })
      }),
    )
  })

  it('filters by recommended key', () => {
    fc.assert(
      fc.property(fc.char(), (recommendedKey) => {
        expect(getSearchCondition({ filters: { recommendedKey } })).toMatchSql({
          text: `
            "song"."recommended_key" = $1
          `,
          values: [recommendedKey],
        })
      }),
    )
  })

  it('filters by bpm', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1 }), (bpm) => {
        expect(getSearchCondition({ filters: { bpm } })).toMatchSql({
          text: `
            "song"."bpm" = $1
          `,
          values: [bpm],
        })
      }),
    )
  })

  it('filters by time signature', () => {
    fc.assert(
      fc.property(fc.nat(), fc.nat(), (top, bottom) => {
        expect(
          getSearchCondition({ filters: { timeSignature: [top, bottom] } }),
        ).toMatchSql({
          text: `
              "song"."time_signature_top" = $1 AND
              "song"."time_signature_bottom" = $2
            `,
          values: [top, bottom],
        })
      }),
    )
  })

  it('combines conditions', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.char(),
        fc.integer({ min: 1 }),
        fc.nat(),
        fc.nat(),
        (query, recommendedKey, bpm, top, bottom) => {
          const { text } = getSearchCondition({
            query,
            filters: {
              recommendedKey,
              bpm,
              timeSignature: [top, bottom],
            },
          })
          expect(text).toContain('"song"."title"')
          expect(text).toContain('"song"."recommended_key"')
          expect(text).toContain('"song"."bpm"')
          expect(text).toContain('"song"."time_signature_top"')
          expect(text).toContain('"song"."time_signature_bottom"')
        },
      ),
    )
  })
})
