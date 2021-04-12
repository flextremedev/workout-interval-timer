export const toTwoDigitString = (value: number): string =>
  value < 10 ? `0${value}` : String(value);
