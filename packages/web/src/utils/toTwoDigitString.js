export const toTwoDigitString = (value) =>
  value < 10 ? `0${value}` : String(value);
