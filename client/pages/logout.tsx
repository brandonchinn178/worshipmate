import { useEffect } from 'react'

import { logout } from '~/auth/client'

function Logout() {
  useEffect(() => {
    logout()
  }, [])

  return null
}

export const getStaticProps = async () => {
  return {
    props: {
      header: false,
    },
  }
}

export default Logout
