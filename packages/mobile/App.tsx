import { useTimerMachine } from '@interval-timer/core';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { Button } from './src/components/Button/Button';
import { DurationInput } from './src/components/DurationInput/DurationInput';
import { Input } from './src/components/Input/Input';
import { useTheme } from './src/hooks/useTheme';
import { theme } from './src/theme';

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

  const { colors, spaces, shadows, fontSizes } = useTheme();

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

  const themedCardStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.surface,
    borderRadius: spaces.m,
    padding: spaces.m,
    margin: spaces.m,
    ...shadows.foreground,
  };

  const themedButtonStyle: StyleProp<ViewStyle> = {
    height: spaces.xl,
    borderRadius: spaces.m,
    backgroundColor: colors.primary,
    padding: spaces.m,
    margin: spaces.m,
    ...shadows.foreground,
  };

  const themedLabelStyle: StyleProp<TextStyle> = {
    color: colors.primary,
    fontSize: fontSizes.label,
    letterSpacing: 0.625,
  };

  const themedInputStyle: StyleProp<TextStyle> = {
    marginBottom: spaces.m,
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View />
        <View>
          <Text style={styles.heading}>Welcome!</Text>
          <View style={[styles.card, themedCardStyle]}>
            <Input
              label="Rounds"
              value={String(rounds)}
              onBlur={setRounds}
              type="number"
              labelStyle={[styles.label, themedLabelStyle]}
              style={themedInputStyle}
            />
            <DurationInput
              value={workInterval}
              onChange={setWorkInterval}
              label="Work Interval"
              labelStyle={[styles.label, themedLabelStyle]}
              style={themedInputStyle}
            />
            <DurationInput
              value={breakInterval}
              onChange={setBreakInterval}
              label="Break Interval"
              labelStyle={[styles.label, themedLabelStyle]}
              style={themedInputStyle}
            />
          </View>
        </View>
        <Button
          onPress={toggleTimer}
          style={[themedButtonStyle, styles.button]}
        >
          <Text style={{ color: colors.surface }}>Go</Text>
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSizes.heading,
    fontWeight: '600',
    marginBottom: theme.spaces.s,
    marginLeft: theme.spaces.m,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  card: {
    height: 'auto',
  },
  button: {
    alignSelf: 'stretch',
    marginBottom: theme.spaces.l,
  },
  label: {
    fontWeight: '600',
  },
});
