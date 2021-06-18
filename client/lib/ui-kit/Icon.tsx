import EditSvg from './icons/edit.svg'
import SearchSvg from './icons/search.svg'

const icons = {
  edit: EditSvg,
  search: SearchSvg,
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
