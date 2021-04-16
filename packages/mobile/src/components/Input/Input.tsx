import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { theme } from '../../theme';

type InputProps = Omit<TextInputProps, 'onBlur'> & {
  label?: string;
  value: string;
  type?: 'text' | 'number';
  onChange?: (text: string) => void;
  onBlur?: (value: string) => void;
  readOnly?: boolean;
  testID?: string;
};

export function Input({
  label,
  value: valueFromProps,
  type = 'text',
  onChange,
  onBlur,
  testID,
  readOnly,
  ...restProps
}: InputProps): JSX.Element {
  const [value, setValue] = React.useState(valueFromProps);
  const [inputDone, setInputDone] = React.useState(true);
  const [selection, setSelection] = React.useState<
    { start: number; end: number } | undefined
  >(undefined);

  if (valueFromProps !== value && inputDone) {
    setValue(valueFromProps);
  }

  const setValueBasedOnType = (text: string): void => {
    const isNumber = /^[0-9]*$/.test(text);
    if (type !== 'number' || (type === 'number' && isNumber)) {
      setValue(text);
    }
  };

  const handleChangeText = (text: string): void => {
    setSelection(undefined);
    setInputDone(false);
    setValueBasedOnType(text);
    if (onChange) {
      onChange(text);
    }
  };
  const handleFocus = (): void => {
    setSelection({ start: 0, end: value.length });
  };
  const handleBlur = (): void => {
    setInputDone(true);
    if (onBlur) {
      onBlur(value || '0');
    }
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        style={styles.input}
        editable={!readOnly}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        onFocus={handleFocus}
        selection={selection}
        keyboardType={type === 'number' ? 'number-pad' : restProps.keyboardType}
        testID={testID}
        {...restProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  label: {},
  input: {
    fontSize: theme.fontSizes.input,
  },
});
