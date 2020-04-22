const MILLISECONDS_PER_SECOND = 1000;
export const hasOneSecondElapsed = (
  fromMilliseconds,
  toMilliseconds = Date.now()
) => {
  return toMilliseconds >= fromMilliseconds + MILLISECONDS_PER_SECOND;
};
