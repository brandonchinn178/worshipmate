export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

export const map2 = <A, B>(arr: [A, A], func: (value: A) => B): [B, B] => {
  const [x1, x2] = arr
  return [func(x1), func(x2)]
}

export function* range(start: number, end: number): Generator<number> {
  for (let n = start; n < end; n++) {
    yield n
  }
}

export function* takeWhile<T>(arr: Iterable<T>, func: (value: T) => boolean): Generator<T> {
  for (const val of arr) {
    if (!func(val)) return
    yield val
  }
}
