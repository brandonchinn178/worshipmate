const baseColors = {
  darkTeal: '#134B4E',
  pink: '#FF9797',
  red: '#A8201A',

  // grayscale
  white: '#FFF',
  black: '#000',
  lightGray: '#999',
}

const colorNames = {
  primary: baseColors.darkTeal,
  secondary: baseColors.pink,
  error: baseColors.red,
}

export const colors = {
  ...baseColors,
  ...colorNames,
}
