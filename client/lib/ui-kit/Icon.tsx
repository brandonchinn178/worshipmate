import dynamic from 'next/dynamic'
import React, { FC } from 'react'

type IconName = 'search'

type Props = {
  name: IconName
}

export const Icon: FC<Props> = ({ name }) => {
  const IconComponent = dynamic(import(`./icons/${name}.svg`))
  return <IconComponent />
}
