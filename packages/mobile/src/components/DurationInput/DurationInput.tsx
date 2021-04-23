import { getMinutes, getSeconds, setMinutes, setSeconds } from 'date-fns';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '../../theme';
import { DoubleDigitInput } from '../DoubleDigitInput/DoubleDigitInput';

type DurationInputProps = {
  value: Date;
  label?: string;
  dataTestId?: string;
  onChange?: (date: Date) => void;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};
export function DurationInput({
  dataTestId,
  value,
  onChange,
  label,
  readOnly,
  style,
  labelStyle,
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
    <View style={[styles.container]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View style={styles.input}>
        <DoubleDigitInput
          value={String(getMinutes(value))}
          onChangeText={handleMinutesChange}
          testID={dataTestId && `${dataTestId}-minutes`}
          style={[styles.textInput, style]}
          editable={!readOnly}
        />
        <Text style={[styles.textInput, style]}>:</Text>
        <DoubleDigitInput
          value={String(getSeconds(value))}
          onChangeText={handleSecondsChange}
          data-testid={dataTestId && `${dataTestId}-seconds`}
          style={[styles.textInput, style]}
          editable={!readOnly}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch' },
  label: {
    fontSize: theme.fontSizes.label,
    letterSpacing: 0.625,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: theme.spaces.xs,
    marginBottom: theme.spaces.s,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: theme.fontSizes.input,
  },
});
