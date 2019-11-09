import React, { FC } from 'react'

import SearchIcon from './icons/search.svg'

const icons = {
  search: SearchIcon,
}

type Props = {
  name: keyof typeof icons
}

export const Icon: FC<Props> = ({ name }) => {
  const IconComponent = icons[name]
  return <IconComponent />
}
