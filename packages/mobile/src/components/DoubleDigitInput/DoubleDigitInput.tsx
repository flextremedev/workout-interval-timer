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
  const inputRef = React.useRef<TextInput | null>(null);
  const [inputStatus, setInputStatus] = React.useState<
    'initial' | 'editing' | 'done'
  >('initial');

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
    if (input.length === 2) {
      setInputStatus('done');
    } else {
      setInputStatus('editing');
    }
    onChangeText(input);
  };

  const handleFocus = (): void => {
    setInputStatus('initial');
  };

  const handleBlur = (): void => {
    setInputStatus('done');
  };

  return (
    <TextInput
      value={
        inputStatus === 'editing' ? value : toTwoDigitString(Number(value))
      }
      onChangeText={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      selection={
        inputSelected
          ? { start: 0, end: inputStatus === 'editing' ? value.length : 2 }
          : { start: 1, end: 1 }
      }
      ref={inputRef}
      style={style}
      editable={editable}
      caretHidden={!editable}
      keyboardType="number-pad"
      testID={testID}
    />
  );
};

export { DoubleDigitInput };
