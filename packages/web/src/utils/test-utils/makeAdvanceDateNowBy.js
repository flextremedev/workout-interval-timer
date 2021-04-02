export function makeAdvanceDateNowBy(initialDate) {
  let date = initialDate;
  Date.now = () => date;
  return function advanceDateNowBy(millisecondsToAdvance) {
    date += millisecondsToAdvance;
    Date.now = () => date;
  };
}
