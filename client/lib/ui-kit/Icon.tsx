import Image, { ImageProps } from 'next/image'

type IconNames = 'edit' | 'search'

// https://github.com/vercel/next.js/issues/25344
type LayoutValue = 'fill' | 'fixed' | 'intrinsic' | 'responsive' | undefined
type ImageSize =
  | {
      width?: never
      height?: never
      /** @deprecated Use `layout="fill"` instead */
      unsized: true
    }
  | { width?: never; height?: never; layout: 'fill' }
  | {
      width: number | string
      height: number | string
      layout?: Exclude<LayoutValue, 'fill'>
    }
type PlaceholderValue = 'blur' | 'empty'
type ImagePlaceholder =
  | {
      placeholder?: Exclude<PlaceholderValue, 'blur'>
      blurDataURL?: never
    }
  | { placeholder: 'blur'; blurDataURL: string }

type IconProps = Omit<ImageProps, 'src'> &
  ImageSize &
  ImagePlaceholder & {
    name: IconNames
  }

export function Icon({ name, ...props }: IconProps) {
  return <Image src={`/${name}.svg`} {...props} />
}
