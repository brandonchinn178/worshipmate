import { NextRouter } from 'next/router'

// https://github.com/vercel/next.js/blob/bbc1a21c749c423e842586ab116889c9f9c7024e/packages/next/next-server/lib/router/router.ts#L248
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/664e93c54b6fbf6cae66460ad506f45e59bda3d9/types/node/querystring.d.ts#L11
export type QueryStringValue = string | string[]

/**
 * Use the given router to update the given key in the querystring with the
 * given callback. If `null`, an empty string, or an empty array is returned,
 * removes the key from the querystring.
 */
export const modifyQueryString = (
  router: NextRouter,
  key: string,
  callback: (value: QueryStringValue | undefined) => QueryStringValue | null,
) => {
  const value = callback(router.query[key])
  const query = {
    ...router.query,
    [key]: value,
  }

  if (value === null || value === '' || value === []) {
    delete query[key]
  }

  router.push({
    pathname: router.pathname,
    query,
  })
}

/**
 * Same as `modifyQueryString`, except takes a constant value instead of a
 * callback.
 */
export const setQueryString = (
  router: NextRouter,
  key: string,
  value: QueryStringValue | null,
) => {
  modifyQueryString(router, key, () => value)
}
