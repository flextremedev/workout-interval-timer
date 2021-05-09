import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { theme } from '../../theme';

type LabelProps = {
  style?: StyleProp<TextStyle>;
};
export const Label: React.FC<LabelProps> = ({ children, style }) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSizes.label,
    letterSpacing: 0.625,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: theme.spaces.xs,
    marginBottom: theme.spaces.s,
  },
});
