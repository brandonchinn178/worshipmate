/**
 * mergeLists([1, 2, 3], [4, 5, 6]) => [1, 4, 2, 5, 3, 6]
 */
export const mergeLists = <T>(arr1: T[], arr2: T[]): T[] => {
  const result = []

  arr1.forEach((x, i) => {
    result.push(x)
    if (i < arr2.length) {
      result.push(arr2[i])
    }
  })

  if (arr2.length > arr1.length) {
    result.push(...arr2.slice(arr1.length))
  }

  return result
}
