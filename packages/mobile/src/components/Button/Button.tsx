import * as React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

type ButtonProps = {
  onPress?: () => void;
};
const Button: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableHighlight style={styles.button} onPress={onPress}>
      {children}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
export { Button };
