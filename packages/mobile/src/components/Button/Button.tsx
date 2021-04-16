import * as React from 'react';
import { StyleProp, StyleSheet, Pressable, ViewStyle } from 'react-native';

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
    alignSelf: 'stretch',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export { Button };
