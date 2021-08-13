// TODO: break out into separate react-hook-form-select package?

import * as _ from 'lodash'
import { Control, Controller, Path } from 'react-hook-form'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'

export type SelectProps<FormValues> = Omit<
  ReactSelectProps,
  'value' | 'onChange' | 'onBlur'
> & {
  name: Path<FormValues>
  control: Control<FormValues>
}

export function Select<FormValues>({
  name,
  control,
  options,
  ...props
}: SelectProps<FormValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <ReactSelect
            instanceId={name}
            inputId={name}
            options={options}
            value={_.find(options, { value })}
            onChange={(option) => onChange(option?.value)}
            onBlur={onBlur}
            {...props}
          />
        )
      }}
    />
  )
}

// TODO: add Async/Creatable versions
// After react-select v5, have single Select component, used with
// useAsync/useCreatable hooks
