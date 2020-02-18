import { NextRouter } from 'next/router'

// https://github.com/zeit/next.js/blob/3f691eaa45e8f802f9977ff050f66ac64f016e74/packages/next/next-server/lib/router/router.ts#L37
// https://github.com/sindresorhus/query-string/blob/7712622f5ae8cc1f99ae45f4af1a1965efec44ac/index.d.ts#L127
export type QueryStringValue = string | string[] | null | undefined

export const modifyQueryString = (
  router: NextRouter,
  key: string,
  callback: (value: QueryStringValue) => QueryStringValue,
) => {
  const value = callback(router.query[key])
  const query = {
    ...router.query,
    [key]: value,
  }

  if (!value) {
    delete query[key]
  }

  router.push({
    pathname: router.pathname,
    query,
  })
}

export const setQueryString = (
  router: NextRouter,
  key: string,
  value?: string,
) => {
  modifyQueryString(router, key, () => value)
}
