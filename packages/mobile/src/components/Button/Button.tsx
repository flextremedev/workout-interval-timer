import * as React from 'react';
import { StyleProp, StyleSheet, Pressable, ViewStyle } from 'react-native';

import { theme } from '../../theme';

type ButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
const Button: React.FC<ButtonProps> = ({ onPress, children, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    minWidth: 56,
    borderRadius: 56,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spaces.l,
    paddingRight: theme.spaces.l,
  },
});
export { Button };
