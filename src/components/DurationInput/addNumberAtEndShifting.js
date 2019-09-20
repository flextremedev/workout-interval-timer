const SECONDS_PER_MINUTE = 60;
export const addNumberAtEndShifting = (acc, val) => {
  const [firstDigit, secondDigit] = [...acc];
  if (!isNaN(firstDigit) && !isNaN(secondDigit) && !isNaN(val)) {
    const newNumber = `${secondDigit}${val}`;
    if (Number(newNumber) < SECONDS_PER_MINUTE) {
      return newNumber;
    }
    return `0${val}`;
  }
  return acc;
};
