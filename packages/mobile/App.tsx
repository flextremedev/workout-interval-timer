import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Input } from './src/components/Input/Input';

// eslint-disable-next-line import/no-default-export
export default function App(): JSX.Element {
  const [rounds, setRounds] = React.useState('0');
  return (
    <View style={styles.container}>
      <Input label="Rounds" value={rounds} onBlur={setRounds} type="number" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
