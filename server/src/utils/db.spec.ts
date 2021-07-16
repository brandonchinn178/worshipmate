import { camelCaseRow } from './db'

describe('camelCaseRow', () => {
  it('camelcases keys', () => {
    expect(camelCaseRow({ foo_bar: 'a' })).toEqual({ fooBar: 'a' })
  })
})
