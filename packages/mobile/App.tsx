import { useTimerMachine } from '@interval-timer/core';
import * as React from 'react';
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
import { RoundInput } from './src/components/RoundInput/RoundInput';
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

  const themedContainerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.background,
  };

  const themedButtonStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.background,
    paddingLeft: spaces.m,
    paddingRight: spaces.m,
  };

  const themedLabelStyle: StyleProp<TextStyle> = {
    color: colors.primary,
  };

  const themedInputStyle: StyleProp<TextStyle> = {
    marginBottom: spaces.m,
  };
  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.background }} />
      <StatusBar backgroundColor={colors.background} barStyle={'default'} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <View style={{ height: 44, backgroundColor: colors.background }} />
        <View style={{ backgroundColor: colors.primary, flex: 1 }}>
          <View style={[styles.container, themedContainerStyle]}>
            <View style={styles.formFieldContainer}>
              <RoundInput
                rounds={rounds}
                setRounds={setRounds}
                labelStyle={[themedLabelStyle]}
                style={themedInputStyle}
              />
              <DurationInput
                value={workInterval}
                onChange={setWorkInterval}
                label="WORK"
                labelStyle={[styles.label, themedLabelStyle]}
                style={themedInputStyle}
              />
              <DurationInput
                value={breakInterval}
                onChange={setBreakInterval}
                label="BREAK"
                labelStyle={[styles.label, themedLabelStyle]}
                style={themedInputStyle}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button
              onPress={toggleTimer}
              style={[styles.button, themedButtonStyle]}
            >
              <Text
                style={{
                  color: colors.primary,
                }}
              >
                Go
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderBottomRightRadius: theme.spaces.l,
    borderBottomLeftRadius: theme.spaces.l,
  },
  formFieldContainer: {
    alignSelf: 'center',
  },
  input: {},
  button: {
    marginTop: theme.spaces.xxl,
    marginBottom: theme.spaces.xxl,
  },
});
