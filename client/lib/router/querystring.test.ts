import { modifyQueryString, setQueryString } from './querystring'
import { getNewQuery, mkRouter } from './testutils'

describe('setQueryString', () => {
  it('sets a querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'bar',
      },
    })

    setQueryString(router, 'foo', 'baz')
    expect(getNewQuery(router)).toMatchObject({
      foo: 'baz',
    })
  })

  it('sets a new querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'bar',
      },
    })

    setQueryString(router, 'foo2', 'baz')
    expect(getNewQuery(router)).toMatchObject({
      foo: 'bar',
      foo2: 'baz',
    })
  })

  it('unsets a querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'bar',
      },
    })

    setQueryString(router, 'foo', undefined)
    expect(getNewQuery(router)).toMatchObject({})
  })
})

describe('modifyQueryString', () => {
  it('modifies a querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'hello',
      },
    })

    modifyQueryString(router, 'foo', (v) => (v ? v + '_world' : 'new'))
    expect(getNewQuery(router)).toMatchObject({
      foo: 'hello_world',
    })
  })

  it('sets a new querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'bar',
      },
    })

    modifyQueryString(router, 'foo2', (v) => (v ? v + '_world' : 'new'))
    expect(getNewQuery(router)).toMatchObject({
      foo: 'bar',
      foo2: 'new',
    })
  })

  it('unsets a querystring value', () => {
    const router = mkRouter({
      query: {
        foo: 'bar',
      },
    })

    modifyQueryString(router, 'foo', () => null)
    expect(getNewQuery(router)).toMatchObject({})
  })
})
