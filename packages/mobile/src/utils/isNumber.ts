const NUMBER_REGEX = /^\d+$/;
export const isNumber = (maybeNumber: string): boolean => {
  return NUMBER_REGEX.test(maybeNumber);
};
