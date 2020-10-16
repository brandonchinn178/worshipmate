import * as _ from 'lodash'
import Router, { NextRouter } from 'next/router'

export const mkRouter = ({ query }: { query: NextRouter['query'] }) => {
  const router = _.clone(Router)
  router.query = query
  router.push = jest.fn()
  return router
}

export const getNewQuery = (router: NextRouter): Record<string, unknown> => {
  return _.last((router.push as jest.Mock).mock.calls)[0].query
}
