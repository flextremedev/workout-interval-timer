import { Ionicons } from '@expo/vector-icons';
import { timerStates, useTimerMachine } from '@interval-timer/core';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { Button } from '../components/Button/Button';
import { DurationInput } from '../components/DurationInput/DurationInput';
import { RoundInput } from '../components/RoundInput/RoundInput';
import { useTheme } from '../hooks/useTheme';
import { theme } from '../theme';

export function Home(): JSX.Element {
  const {
    setBreakInterval,
    setRounds,
    setWorkInterval,
    state,
    service,
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

  const { colors, fontSizes, isDark, toggle } = useTheme();

  const { breakInterval, rounds, workInterval, timeLeft } = state.context;

  const themedContainerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.background,
  };

  const themedButtonStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.button,
  };
  const themedHeaderStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.background,
  };

  const themedLabelStyle: StyleProp<TextStyle> = {
    color: colors.primary,
  };

  const themedInputStyle: StyleProp<TextStyle> = {
    color: colors.text,
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.background }} />
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <View style={[styles.header, themedHeaderStyle]}>
          <Pressable
            onPress={toggle}
            hitSlop={16}
            testID={`color-mode-toggle-${isDark ? 'light' : 'dark'}`}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={24}
              color={colors.text}
              style={{ marginRight: theme.spaces.s }}
            />
          </Pressable>
        </View>
        <View style={{ backgroundColor: colors.primary, flex: 1 }}>
          <View style={[styles.container, themedContainerStyle]}>
            {state.matches(timerStates.STOPPED) ? (
              <KeyboardAvoidingView behavior="padding">
                <ScrollView>
                  <View style={styles.formFieldContainer}>
                    <RoundInput
                      rounds={rounds}
                      setRounds={setRounds}
                      labelStyle={[themedLabelStyle, styles.input]}
                      style={themedInputStyle}
                    />
                    <DurationInput
                      value={workInterval}
                      onChange={setWorkInterval}
                      label="WORK"
                      labelStyle={[themedLabelStyle]}
                      style={[themedInputStyle, styles.input]}
                      testID="work-interval-duration-input"
                    />
                    <DurationInput
                      value={breakInterval}
                      onChange={setBreakInterval}
                      label="BREAK"
                      labelStyle={[themedLabelStyle]}
                      style={[themedInputStyle, styles.input]}
                      testID="break-interval-duration-input"
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            ) : (
              <View
                style={{
                  width: '70%',
                  height: '100%',
                  alignSelf: 'center',
                }}
              >
                <View
                  style={[
                    styles.countdownContainer,
                    {
                      position: 'relative',
                      height: '100%',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <svg
                    viewBox="0 0 304 304"
                    width="100%"
                    height="100%"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: 'rotateZ(270deg)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <circle
                      cx={152}
                      cy={152}
                      r={149.5}
                      stroke={colors.muted}
                      strokeWidth="4"
                    />
                    <circle
                      cx={152}
                      cy={152}
                      r={149.5}
                      stroke={colors.primary}
                      strokeWidth="4"
                      strokeDashoffset={50}
                      strokeDasharray={939}
                      strokeLinecap="round"
                    />
                  </svg>
                  <DurationInput
                    value={timeLeft}
                    labelStyle={[themedLabelStyle]}
                    style={themedInputStyle}
                    testID="work-interval-duration-input"
                  />
                </View>
              </View>
            )}
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button
              onPress={toggleTimer}
              style={[styles.button, themedButtonStyle]}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="play"
                  size={24}
                  color={colors.primary}
                  suppressHighlighting
                  style={{ marginRight: theme.spaces.s }}
                />
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: '700',
                    fontSize: fontSizes.label,
                  }}
                >
                  START
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: theme.spaces.m,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderBottomRightRadius: theme.spaces.l,
    borderBottomLeftRadius: theme.spaces.l,
  },
  formFieldContainer: {
    alignSelf: 'center',
  },
  input: {
    marginBottom: theme.spaces.s,
  },
  button: {
    marginTop: theme.spaces.xxl,
    marginBottom: theme.spaces.xxl,
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  countdownContainer: {
    transform: [{ translateY: 14 }],
  },
});
