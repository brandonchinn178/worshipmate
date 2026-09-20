import { createContext } from "svelte"
import type { HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements"

// All Form values types should subclass this
export type BaseFormValues = Record<string, string>

export type FormProps<T extends BaseFormValues> = {
  id: string
  values: T
}

type InputAttrs = HTMLInputAttributes & HTMLTextareaAttributes

export type FormState<T extends BaseFormValues> = {
  isPending: boolean
  values: T
  errors: { [K in keyof T]?: string | null }
  fieldId: (name: FieldName<T>) => string
  field: (name: FieldName<T>) => InputAttrs
  onsubmit: (callback: () => Promise<void>) => (e: SubmitEvent) => Promise<void>
}

export type FieldName<T> = keyof T & string

const [getFormContext, setFormContext] = createContext<FormState<BaseFormValues>>()

export const getForm = <T extends BaseFormValues>(): FormState<T> => {
  return getFormContext() as FormState<T>
}

export const init = <T extends BaseFormValues>({ id, values }: FormProps<T>): FormState<T> => {
  const fieldId = (name: FieldName<T>) => `${id}-${name}`

  const form: FormState<T> = $state({
    isPending: false,
    values,
    errors: {},
    fieldId,
    field: (name: FieldName<T>) => {
      const oninput: InputAttrs["oninput"] = (e) => {
        const values = form.values as BaseFormValues
        values[name] = e.currentTarget.value
      }
      return {
        id: fieldId(name),
        name,
        value: form.values[name],
        oninput,
      }
    },
    onsubmit: (callback) => async (e: SubmitEvent) => {
      e.preventDefault()
      form.isPending = true
      try {
        await callback()
      } finally {
        form.isPending = false
      }
    },
  })

  setFormContext(form)
  return form
}
