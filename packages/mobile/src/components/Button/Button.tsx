import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type ButtonProps = {
  onPress?: () => void;
};
const Button: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
export { Button };
