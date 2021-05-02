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
  label: string;
  testID?: string;
  onChange: (date: Date) => void;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};
export function DurationInput({
  testID,
  value,
  onChange,
  label,
  readOnly,
  style,
  labelStyle,
}: DurationInputProps): JSX.Element {
  const handleMinutesChange = (minutes: string): void => {
    onChange(setMinutes(new Date(value.valueOf()), Number(minutes)));
  };

  const handleSecondsChange = (seconds: string): void => {
    onChange(setSeconds(new Date(value.valueOf()), Number(seconds)));
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.input}>
        <DoubleDigitInput
          value={String(getMinutes(value))}
          onChangeText={handleMinutesChange}
          testID={testID && `${testID}-minutes`}
          style={[styles.textInput, style]}
          editable={!readOnly}
        />
        <Text style={[styles.textInputSeparator, style]}>:</Text>
        <DoubleDigitInput
          value={String(getSeconds(value))}
          onChangeText={handleSecondsChange}
          testID={testID && `${testID}-seconds`}
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
    fontWeight: '700',
    marginTop: theme.spaces.xs,
    marginBottom: theme.spaces.s,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputSeparator: {
    fontSize: theme.fontSizes.input,
  },
  textInput: {
    fontSize: theme.fontSizes.input,
    width: 72,
  },
});
