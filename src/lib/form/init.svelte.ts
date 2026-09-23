import { createContext } from "svelte"
import type { HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements"
import { SvelteMap } from "svelte/reactivity"

// All Form values types should subclass this
export type BaseFormValues = Record<string, unknown>

export type FormProps<T extends BaseFormValues> = {
  id: string
  fields: {
    [K in keyof T]: FieldOptions<T[K]>
  }
  onSubmit: (values: T) => Promise<void>
}

export type FieldOptions<T = unknown> = {
  initial: string
  required?: boolean
} & (T extends string
  ? {
      parse?: (value: string) => string
    }
  : {
      parse: (value: string) => T
    })

type InputAttrs = HTMLInputAttributes & HTMLTextareaAttributes

export type FormState<T extends BaseFormValues> = {
  isPending: boolean
  values: ParsedValues<T>
  errors: Map<FieldName<T>, string>
  fieldId: (name: FieldName<T>) => string
  field: (name: FieldName<T>) => InputAttrs
  touched: Record<FieldName<T>, boolean>
  onsubmit: (e: SubmitEvent) => Promise<void>
}

export type FieldName<T> = keyof T & string
type ParsedValues<T> = { [K in keyof T]: T[K] | null }

const [getFormContext, setFormContext] = createContext<FormState<BaseFormValues>>()

export const getForm = <T extends BaseFormValues>(): FormState<T> => {
  return getFormContext() as FormState<T>
}

export const init = <T extends BaseFormValues>({
  id,
  fields,
  onSubmit,
}: FormProps<T>): FormState<T> => {
  const fromFields = <R>(f: (name: FieldName<T>) => R): Record<FieldName<T>, R> => {
    return Object.fromEntries(
      // keep-multiline
      Object.keys(fields).map((name) => [name, f(name)]),
    ) as Record<FieldName<T>, R>
  }

  const fieldId = (name: FieldName<T>) => `${id}-${name}`
  const rawValues = $state(fromFields((name) => fields[name].initial))
  const errors = new SvelteMap<FieldName<T>, string>()

  const parseValue = (name: FieldName<T>, value: string): T[FieldName<T>] | null => {
    try {
      const { required, parse } = fields[name]
      if (required && value === "") {
        throw new Error(`Field is required`)
      }
      const result = (parse ? parse(value) : value) as T[FieldName<T>]
      errors.delete(name)
      return result
    } catch (e) {
      errors.set(name, (e as Error).message)
      return null
    }
  }

  const form: FormState<T> = $state({
    isPending: false,
    values: fromFields((name) => parseValue(name, rawValues[name])) as ParsedValues<T>,
    errors,
    fieldId,
    field: (name: FieldName<T>) => {
      const oninput: InputAttrs["oninput"] = (e) => {
        const value = e.currentTarget.value
        rawValues[name] = value
        form.values[name] = parseValue(name, value)
      }
      return {
        id: fieldId(name),
        name,
        value: rawValues[name],
        oninput,
      }
    },
    touched: fromFields(() => false),
    onsubmit: async (e: SubmitEvent) => {
      e.preventDefault()

      form.touched = fromFields(() => true)
      if (form.errors.size > 0) {
        return
      }

      form.isPending = true
      try {
        await onSubmit(form.values as T)
      } finally {
        form.isPending = false
      }
    },
  })

  setFormContext(form as FormState<BaseFormValues>)
  return form
}
