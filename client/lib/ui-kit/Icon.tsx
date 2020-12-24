import Image, { ImageProps } from 'next/image'

type IconNames = 'search'

type IconProps = Omit<ImageProps, 'src'> & {
  name: IconNames
}

export function Icon({ name, ...props }: IconProps) {
  return <Image src={`/${name}.svg`} {...props} />
}
