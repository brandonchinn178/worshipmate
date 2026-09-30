export type Option = {
  label: string
  value: string
}

export type Outputs = {
  isNew: boolean
}

export const initComboboxOutputs = (): Outputs => {
  return {
    isNew: false,
  }
}
