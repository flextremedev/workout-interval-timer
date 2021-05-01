import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../theme';
import { Input } from '../Input/Input';

type RoundInputProps = {
  rounds: number;
  setRounds: (rounds: string) => void;
  testID?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
};

const MAX = 99;
const MIN = 1;

const canCountUp = (rounds: number): boolean => rounds < MAX;
const canCountDown = (rounds: number): boolean => rounds > MIN;

export const RoundInput = ({
  rounds,
  setRounds,
  labelStyle,
  style,
  testID,
}: RoundInputProps): JSX.Element => {
  const { colors } = useTheme();
  const handleDecrement = (): void => {
    if (canCountDown(rounds)) {
      setRounds(String(rounds - 1));
    }
  };
  const handleIncrement = (): void => {
    if (canCountUp(rounds)) {
      setRounds(String(rounds + 1));
    }
  };

  return (
    <View>
      <Text style={[styles.label, labelStyle]}>ROUNDS</Text>
      <View style={styles.container}>
        <Pressable
          testID={testID && `${testID}-decrement`}
          onPress={handleDecrement}
        >
          <Ionicons name="remove" size={32} color={colors.text} />
        </Pressable>
        <Input
          value={String(rounds)}
          onBlur={setRounds}
          type="number"
          style={[styles.textInput, style]}
          max={MAX}
          min={MIN}
        />
        <Pressable
          onPress={handleIncrement}
          testID={testID && `${testID}-increment`}
        >
          <Ionicons name="add" size={32} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    width: 72,
  },
  label: {
    fontSize: theme.fontSizes.label,
    letterSpacing: 0.625,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: theme.spaces.xs,
    marginBottom: theme.spaces.s,
  },
});
