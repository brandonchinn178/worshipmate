import * as Icons from 'akar-icons'

const icons = {
  edit: Icons.Edit,
  search: Icons.Search,
}

type IconNames = keyof typeof icons

type IconProps = {
  name: IconNames
  width?: number
  height?: number
}

export function Icon({ name, ...props }: IconProps) {
  const IconSvg = icons[name]
  return <IconSvg data-testid={`icon-${name}`} {...props} />
}
