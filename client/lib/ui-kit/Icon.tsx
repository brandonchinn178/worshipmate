import Image, { ImageProps } from 'next/image'

type IconNames = 'search'

// copied from https://github.com/vercel/next.js/blob/9b3edd3b2476b9915fe8c94071a77ac8e8f14499/packages/next/client/image.tsx#L48-L59
// need to rewrite for typescript
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

type IconProps = Omit<ImageProps, 'src'> &
  ImageSize & {
    name: IconNames
  }

export function Icon({ name, ...props }: IconProps) {
  return <Image src={`/${name}.svg`} {...props} />
}
