import * as React from 'react';
export const usePrevious = <Type>(value: Type): Type => {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
