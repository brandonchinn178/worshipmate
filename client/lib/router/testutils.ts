import * as _ from 'lodash'
import { NextRouter } from 'next/router'

type MockRouterConfig = {
  query?: NextRouter['query']
  pathname?: NextRouter['pathname']
}

export const mkRouter = (routerConfig: MockRouterConfig = {}): NextRouter => {
  const { query = {}, pathname = '/' } = routerConfig

  const mockRouter = {
    query,
    pathname,
    push: jest.fn(),
  }

  return (mockRouter as unknown) as NextRouter
}

export const getNewQuery = (router: NextRouter): Record<string, unknown> => {
  return _.last((router.push as jest.Mock).mock.calls)[0].query
}
