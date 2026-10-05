export const setClass = (elem: HTMLElement, className: string, condition: boolean) => {
  if (condition) {
    elem.classList.add(className)
  } else {
    elem.classList.remove(className)
  }
}
