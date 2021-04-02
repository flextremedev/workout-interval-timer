const MILLISECONDS_PER_SECOND = 1000;
export const hasOneSecondElapsed = (
  fromMilliseconds: number,
  toMilliseconds: number = Date.now()
): boolean => {
  return toMilliseconds >= fromMilliseconds + MILLISECONDS_PER_SECOND;
};
