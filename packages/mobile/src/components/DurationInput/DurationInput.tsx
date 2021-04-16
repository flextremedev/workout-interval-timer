import { getMinutes, getSeconds, setMinutes, setSeconds } from 'date-fns';
import * as React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '../../theme';
import { DoubleDigitInput } from '../DoubleDigitInput/DoubleDigitInput';

type DurationInputProps = {
  value: Date;
  label?: string;
  dataTestId?: string;
  onChange?: (date: Date) => void;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
};
export function DurationInput({
  dataTestId,
  value,
  onChange,
  label,
  readOnly,
  style,
}: DurationInputProps): JSX.Element {
  const handleMinutesChange = (minutes: string): void => {
    if (onChange) {
      onChange(setMinutes(new Date(value.valueOf()), Number(minutes)));
    }
  };

  const handleSecondsChange = (seconds: string): void => {
    if (onChange) {
      onChange(setSeconds(new Date(value.valueOf()), Number(seconds)));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.input}>
        <DoubleDigitInput
          value={String(getMinutes(value))}
          onChangeText={handleMinutesChange}
          testID={dataTestId && `${dataTestId}-minutes`}
          style={styles.textInput}
          editable={!readOnly}
        />
        <Text style={styles.textInput}>:</Text>
        <DoubleDigitInput
          value={String(getSeconds(value))}
          onChangeText={handleSecondsChange}
          data-testid={dataTestId && `${dataTestId}-seconds`}
          style={styles.textInput}
          editable={!readOnly}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch' },
  label: {},
  input: { flexDirection: 'row', alignItems: 'center' },
  textInput: {
    fontSize: theme.fontSizes.input,
  },
});
