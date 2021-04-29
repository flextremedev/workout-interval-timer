import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../theme';
import { Input } from '../Input/Input';

type RoundInputProps = {
  rounds: number;
  setRounds: (rounds: string) => void;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<TextStyle>;
};

export const RoundInput = ({
  rounds,
  setRounds,
  labelStyle,
  style,
}: RoundInputProps): JSX.Element => {
  const { colors } = useTheme();
  const handleDecrement = (): void => {
    if (rounds > 1) {
      setRounds(String(rounds - 1));
    }
  };
  const handleIncrement = (): void => {
    setRounds(String(rounds + 1));
  };
  return (
    <View>
      <Text style={[styles.label, labelStyle]}>ROUNDS</Text>
      <View style={styles.container}>
        <Ionicons
          name="remove"
          size={32}
          color={colors.text}
          onPress={handleDecrement}
        />
        <Input
          value={String(rounds)}
          onBlur={setRounds}
          type="number"
          style={style}
        />
        <Ionicons
          name="add"
          size={32}
          color={colors.text}
          onPress={handleIncrement}
        />
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
    width: 76,
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
