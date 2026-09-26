import { createContext } from "svelte"
import type { HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements"

// All Form values types should subclass this
export type BaseFormValues = Record<string, unknown>

/***** Input to Form.init() *****/

export type FormProps<T extends BaseFormValues> = {
  id: string
  fields: {
    [K in keyof T]: FieldOptions<T[K]>
  }
  onSubmit: (values: T) => Promise<void>
}

type FieldOptions<V> = [V] extends [boolean] ? FieldOptionsBoolean : FieldOptionsString<V>
type FieldOptionsBoolean = {
  initial: boolean
}
type FieldOptionsString<V> = {
  initial: string
  required?: boolean
} &
  // `parse` is required if it can't be set to the identity function
  (string extends V // keep-multiline
    ? { parse?: (value: string) => V }
    : { parse: (value: string) => V })

/***** Output of Form.init() + getForm() *****/

type FormState<T extends BaseFormValues> = {
  isPending: boolean
  values: ParsedValues<T>
  errors: Partial<Record<FieldName<T>, string>>
  isValid: boolean
  fieldId: (name: FieldName<T>) => string
  field: (name: FieldName<T>) => InputAttrs
  touched: Record<FieldName<T>, boolean>
  onsubmit: (e: Event) => Promise<void>
}

export type FieldName<T> = keyof T & string
type ParsedValues<T> = { [K in keyof T]: T[K] | null }
type InputAttrs = HTMLInputAttributes & HTMLTextareaAttributes

/***** Context for form, to avoid prop drilling *****/

const [getFormContext, setFormContext] = createContext<FormState<BaseFormValues>>()

export const getForm = <T extends BaseFormValues>(): FormState<T> => {
  return getFormContext() as FormState<T>
}

/***** Form.init() *****/

type InternalFormState<T> = {
  rawValues: RawValues<T>
  isPending: boolean
  touched: Record<FieldName<T>, boolean>
}

export const init = <T extends BaseFormValues>({
  id,
  fields,
  onSubmit,
}: FormProps<T>): FormState<T> => {
  const fieldSpecs = mapValues(fields, (name, field) => {
    return {
      ...initField<T, FieldName<T>>(name, field as FieldOptions<T[FieldName<T>]>),
      id: `${id}-${name}`,
    }
  })

  const formState = $state<InternalFormState<T>>({
    rawValues: mapValues(fieldSpecs, (_, field) => field.initial) as RawValues<T>,
    isPending: false,
    touched: mapValues(fieldSpecs, () => false),
  })

  const parseResults = $derived(
    Object.entries(fieldSpecs).map(([name, spec]) => {
      try {
        const data = spec.parse(formState)
        return { name, data, error: null }
      } catch (e) {
        return { name, data: null, error: e as Error }
      }
    }),
  )
  const errors = $derived(
    Object.fromEntries(
      parseResults.flatMap(({ name, error }) => {
        return error !== null ? [[name, error.message]] : []
      }),
    ),
  ) as Record<FieldName<T>, string>
  const isValid = $derived(Object.keys(errors).length === 0)
  const values = $derived(
    Object.fromEntries(parseResults.map(({ name, data }) => [name, data])),
  ) as ParsedValues<T>

  const fieldId = (name: FieldName<T>) => fieldSpecs[name].id
  const field = (name: FieldName<T>) => {
    const fieldSpec = fieldSpecs[name]
    return {
      id: fieldSpec.id,
      name,
      ...fieldSpec.htmlAttrs(formState),
    }
  }

  const onsubmit = async (e: Event) => {
    e.preventDefault()

    formState.touched = mapValues(fieldSpecs, () => true)
    if (!isValid) {
      return
    }

    formState.isPending = true
    try {
      await onSubmit(values as T)
    } finally {
      formState.isPending = false
    }
  }

  const form: FormState<T> = {
    get isPending() {
      return formState.isPending
    },
    get values() {
      return values
    },
    get errors() {
      return errors
    },
    get isValid() {
      return isValid
    },
    fieldId,
    field,
    get touched() {
      return formState.touched
    },
    onsubmit,
  }

  setFormContext(form as FormState<BaseFormValues>)
  return form
}

type FieldSpec<T, K extends FieldName<T>> = FieldSpecString<T, K> | FieldSpecBoolean<T, K>
const initField = <T, K extends FieldName<T>>(
  name: K,
  options: FieldOptions<T[K]>,
): FieldSpec<T, K> => {
  switch (typeof options.initial) {
    case "string":
      return initFieldString<T, K>(name, options as FieldOptionsString<T[K]>)
    case "boolean":
      return initFieldBoolean<T, K>(name, options as FieldOptionsBoolean)
    default:
      return options.initial satisfies never
  }
}

type FieldSpecString<T, K extends FieldName<T>> = {
  type: "string"
  initial: string
  parse: (formState: InternalFormState<T>) => T[K]
  htmlAttrs: (formState: InternalFormState<T>) => InputAttrs
}
const initFieldString = <T, K extends FieldName<T>>(
  name: K,
  options: FieldOptionsString<T[K]>,
): FieldSpecString<T, K> => {
  const parse = (value: string): T[K] => {
    const { required, parse } = options
    if (required && value === "") {
      throw new Error(`Field is required`)
    }
    if (parse === undefined) {
      // This should work, as `parse` is only allowed to be undefined when
      // T[K] is a superset of `string`
      return value as T[K]
    }
    return parse(value)
  }

  return {
    type: "string" as const,
    initial: options.initial,
    parse: (formState: InternalFormState<T>) => {
      return parse(formState.rawValues[name] as string)
    },
    htmlAttrs: (formState: InternalFormState<T>) => {
      const oninput: InputAttrs["oninput"] = (e) => {
        formState.rawValues[name] = e.currentTarget.value as RawValue<T[K]>
        formState.touched[name] = true
      }
      return {
        value: formState.rawValues[name] as string,
        oninput,
      }
    },
  }
}

type FieldSpecBoolean<T, K extends FieldName<T>> = {
  type: "boolean"
  initial: boolean
  parse: (formState: InternalFormState<T>) => T[K]
  htmlAttrs: (formState: InternalFormState<T>) => InputAttrs
}
const initFieldBoolean = <T, K extends FieldName<T>>(
  name: K,
  options: FieldOptionsBoolean,
): FieldSpecBoolean<T, K> => {
  const parse = (value: boolean): T[K] => {
    return value as T[K]
  }
  return {
    type: "boolean" as const,
    initial: options.initial,
    parse: (formState: InternalFormState<T>) => {
      return parse(formState.rawValues[name] as boolean)
    },
    htmlAttrs: (formState: InternalFormState<T>) => {
      const onchange: InputAttrs["onchange"] = (e) => {
        if (!("checked" in e.currentTarget)) return
        formState.rawValues[name] = e.currentTarget.checked as RawValue<T[K]>
        formState.touched[name] = true
      }
      return {
        checked: formState.rawValues[name] as boolean,
        onchange,
      }
    },
  }
}

type RawValue<V> = V extends boolean ? boolean : string
type RawValues<T> = { [K in keyof T]: RawValue<T[K]> }

/***** Utilities *****/

const mapValues = <K extends string, V, R>(
  object: Record<K, V>,
  func: (key: K, value: V) => R,
): Record<K, R> => {
  return Object.fromEntries(
    Object.entries(object).map(([k, v]) => [k, func(k as K, v as V)]),
  ) as Record<K, R>
}
