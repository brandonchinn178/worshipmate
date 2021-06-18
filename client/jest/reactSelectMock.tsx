import * as _ from 'lodash'
import { FormEvent } from 'react'
import { Props } from 'react-select'

export default function Select({ inputId, options, value, onChange }: Props) {
  const handleChange = (e: FormEvent<HTMLSelectElement>) => {
    if (!onChange) {
      return
    }

    const selectedValue = e.currentTarget?.value

    const option = options?.find(
      (option) => getValue(option) === selectedValue,
    ) as { label: string; value: string }

    if (!option) {
      throw new Error(`Could not select option: ${selectedValue}`)
    }

    onChange(option, { action: 'select-option', option })
  }

  return (
    <select id={inputId} value={getValue(value)} onChange={handleChange}>
      {options?.map((option) => {
        const value = getValue(option)
        return (
          <option key={value} value={value}>
            {option.label}
          </option>
        )
      })}
    </select>
  )
}

const getValue = (option: unknown) => {
  const value = _.get(option, 'value')
  if (value) {
    return typeof value === 'string' ? value : JSON.stringify(value)
  }
  return JSON.stringify(option)
}
