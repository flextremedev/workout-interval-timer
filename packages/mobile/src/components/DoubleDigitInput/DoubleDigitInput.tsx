import { toTwoDigitString } from '@interval-timer/core';
import * as React from 'react';
import { StyleProp, TextInput, TextStyle } from 'react-native';

const CURSOR_AT_END_OF_VALUE = { start: 1, end: 1 };

const isValidDigit = (value: string): boolean => /^[0-5]?[0-9]{1}$/.test(value);

const canBeFollowedByDigit = (value: string): boolean =>
  /^[0-5]{1}$/.test(value);

type DoubleDigitInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<TextStyle>;
  editable?: boolean;
  testID?: string;
};

const DoubleDigitInput = ({
  onChangeText,
  value,
  style,
  editable = true,
  testID,
}: DoubleDigitInputProps): JSX.Element => {
  const [inputSelected, setInputSelected] = React.useState(false);
  const [inputStatus, setInputStatus] = React.useState<
    'initial' | 'editing' | 'done'
  >('initial');

  const oneOrTwoDigitValue =
    inputStatus === 'editing' ? value : toTwoDigitString(Number(value));

  const setInputSelectedInEditableMode = React.useCallback(
    (selected: boolean): void => {
      if (editable) {
        setInputSelected(selected);
      }
    },
    [editable]
  );

  React.useEffect(() => {
    if (inputStatus === 'editing' && canBeFollowedByDigit(value)) {
      setInputSelectedInEditableMode(false);
    } else {
      setInputSelectedInEditableMode(true);
    }
  }, [inputStatus, value, setInputSelectedInEditableMode]);

  const handleChange = (input: string): void => {
    // weird android selection makes checking required
    if (isValidDigit(input)) {
      if (input.length === 2) {
        setInputStatus('done');
      } else {
        setInputStatus('editing');
      }
      onChangeText(input);
    } else {
      setInputStatus('editing');
      onChangeText(input.charAt(input.length - 1));
    }
  };

  const handleFocus = (): void => {
    setInputStatus('initial');
  };

  const handleBlur = (): void => {
    setInputStatus('done');
  };

  return (
    <TextInput
      value={oneOrTwoDigitValue}
      onChangeText={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      selection={
        inputSelected
          ? { start: 0, end: oneOrTwoDigitValue.length }
          : CURSOR_AT_END_OF_VALUE
      }
      style={style}
      editable={editable}
      caretHidden={true}
      keyboardType="number-pad"
      testID={testID}
    />
  );
};

export { DoubleDigitInput };
