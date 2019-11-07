const baseColors = {
  darkTeal: '#134B4E',
  pink: '#FF9797',
  white: '#FFF',
  black: '#000',
}

const colorNames = {
  primary: baseColors.darkTeal,
  secondary: baseColors.pink,
}

export const colors = {
  ...baseColors,
  ...colorNames,
}
