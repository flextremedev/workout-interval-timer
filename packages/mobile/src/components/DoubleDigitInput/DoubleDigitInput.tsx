import { toTwoDigitString } from '@interval-timer/core';
import * as React from 'react';
import { StyleProp, TextInput, TextStyle } from 'react-native';

const isValidDigit = (value: string): boolean => /^[0-5]?[0-9]{1}$/.test(value);

const cantBeFollowedByDigit = (value: string): boolean =>
  /^[6-9]{1}$/.test(value);

const canBeFollowedByDigit = (value: string): boolean =>
  /^[0-5]{1}$/.test(value);

type DoubleDigitInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<TextStyle>;
};

const DoubleDigitInput = ({
  onChangeText,
  value,
  style,
}: DoubleDigitInputProps): JSX.Element => {
  const [inputSelected, setInputSelected] = React.useState(false);
  const inputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    if (value.length >= 2) {
      setInputSelected(true);
    }
  }, [value]);

  React.useEffect(() => {
    if (cantBeFollowedByDigit(value)) {
      setInputSelected(true);
    } else if (canBeFollowedByDigit(value)) {
      setInputSelected(false);
    }
  }, [value]);

  const handleChange = (input: string): void => {
    if (isValidDigit(input)) {
      onChangeText(input);
    } else {
      onChangeText(input.charAt(input.length - 1));
    }
  };

  const handleFocus = (): void => {
    setInputSelected(true);
  };

  const handleBlur = (): void => {
    setInputSelected(false);
    if (value.length < 2) {
      onChangeText(toTwoDigitString(Number(value)));
    }
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      selection={
        inputSelected
          ? { start: 0, end: value.length }
          : { start: value.length, end: value.length }
      }
      ref={inputRef}
      style={style}
    />
  );
};

export { DoubleDigitInput };
