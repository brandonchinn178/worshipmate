export type Option = {
  label: string
  value: string
}

export type Outputs = {
  isNew: boolean
}

export const initSelectOutputs = (): Outputs => {
  return {
    isNew: false,
  }
}
