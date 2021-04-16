import { useTimerMachine } from '@interval-timer/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './src/components/Button/Button';
import { DurationInput } from './src/components/DurationInput/DurationInput';
import { Input } from './src/components/Input/Input';

// eslint-disable-next-line import/no-default-export
export default function App(): JSX.Element {
  const {
    service,
    setBreakInterval,
    setRounds,
    setWorkInterval,
    state,
    toggleTimer,
  } = useTimerMachine();

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const subscription = service.subscribe((newState) => {
      if (newState.event.type === 'START') {
        interval = setInterval(() => {
          service.send({ type: 'TICK' });
        }, 50);
      } else if (newState.event.type === 'STOP') {
        if (interval) {
          clearInterval(interval);
        }
      }
    });
    return (): void => {
      subscription.unsubscribe();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [service]);

  const {
    breakInterval,
    rounds,
    roundsLeft,
    timeLeft,
    workInterval,
  } = state.context;
  return (
    <View style={styles.container}>
      <Input
        label="Rounds"
        value={String(rounds)}
        onBlur={setRounds}
        type="number"
      />
      <Input
        label="Round"
        value={`${rounds - roundsLeft}/${rounds}`}
        readOnly
      />
      <DurationInput
        value={workInterval}
        onChange={setWorkInterval}
        label="Work Interval"
      />
      <DurationInput
        value={breakInterval}
        onChange={setBreakInterval}
        label="Break Interval"
      />
      <DurationInput value={timeLeft} label="Time left" readOnly />
      <Button onPress={toggleTimer}>
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
