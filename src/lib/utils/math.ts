export const divMod = (n: number, d: number): [number, number] => {
  let r = n % d
  if (r !== 0 && r < 0 !== d < 0) r += d
  return [(n - r) / d, r]
}
