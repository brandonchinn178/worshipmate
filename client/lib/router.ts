import { NextRouter } from 'next/router'

export const setQueryString = (
  router: NextRouter,
  key: string,
  value?: string,
) => {
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
