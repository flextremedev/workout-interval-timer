export function formatStringAsDoubleDigit(value) {
  let formattedString = '';
  if (value.length > 2) {
    if (value.substring(value.length, value.length - 2) < 60) {
      formattedString = value.substring(value.length, value.length - 2);
    } else {
      formattedString = `0${value.substring(value.length, value.length - 1)}`;
    }
  } else if (value.length === 1) {
    formattedString = `0${value}`;
  } else if (value.length === 0) {
    formattedString = '00';
  }
  return formattedString;
}
