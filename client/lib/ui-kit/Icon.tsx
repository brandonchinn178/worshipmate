import React from 'react'

import SearchIcon from './icons/search.svg'

const icons = {
  search: SearchIcon,
}

type IconProps = {
  name: keyof typeof icons
}

export function Icon({ name }: IconProps) {
  const IconComponent = icons[name]
  return <IconComponent />
}
