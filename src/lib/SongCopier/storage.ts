import { DEFAULT_OPTIONS, type RenderOptions } from "./render"

const STORAGE_KEY = "song-copier-options"

export const getOptions = (): RenderOptions => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      // Ignore errors
    }
  }
  return DEFAULT_OPTIONS
}

export const setOptions = (options: RenderOptions): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
}
