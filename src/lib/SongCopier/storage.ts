import { DEFAULT_OPTIONS, type RenderOptions } from "$lib/song/render"

const STORAGE_KEY = "song-copier-options"

export const getOptions = (): RenderOptions => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      const options = JSON.parse(data) as RenderOptions
      return {
        // Merge if any new options were added
        ...DEFAULT_OPTIONS,
        ...options,
      }
    } catch {
      // Ignore errors
    }
  }
  return DEFAULT_OPTIONS
}

export const setOptions = (options: RenderOptions): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
}
