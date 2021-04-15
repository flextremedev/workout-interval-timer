import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './src/components/Button/Button';
import { DurationInput } from './src/components/DurationInput/DurationInput';
import { Input } from './src/components/Input/Input';

// eslint-disable-next-line import/no-default-export
export default function App(): JSX.Element {
  const [rounds, setRounds] = React.useState('0');
  const [workInterval, setWorkInterval] = React.useState(new Date(0));
  const [breakInterval, setBreakInterval] = React.useState(new Date(0));
  return (
    <View style={styles.container}>
      <Input label="Rounds" value={rounds} onBlur={setRounds} type="number" />
      <Input label="Round" value="1/2" />
      <DurationInput
        value={workInterval}
        onChange={setWorkInterval}
        label="Work Interval"
      />
      <DurationInput
        value={breakInterval}
        onChange={setBreakInterval}
        label="Work Interval"
      />
      <Button>
        <Text>Go</Text>
      </Button>
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
