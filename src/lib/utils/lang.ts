export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

export const map2 = <A, B>(arr: [A, A], func: (value: A) => B): [B, B] => {
  const [x1, x2] = arr
  return [func(x1), func(x2)]
}
