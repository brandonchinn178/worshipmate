import * as _ from 'lodash'
import Router, { NextRouter } from 'next/router'

import { setQueryString } from './router'

describe('setQueryString', () => {
  const mkRouter = ({ query }: { query: NextRouter['query'] }) => {
    const router = _.clone(Router)
    router.query = query
    router.push = jest.fn()
    return router
  }

  const getNewQuery = (router: NextRouter): object => {
    return _.last((router.push as jest.Mock).mock.calls)[0].query
  }

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
