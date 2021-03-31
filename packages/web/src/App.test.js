import { cleanup, fireEvent } from '@testing-library/react';
import { expectCountDownFrom } from './utils/test-utils/expectCountDownFrom';
import { makeAdvanceDateNowBy } from './utils/test-utils/makeAdvanceDateNowBy';
import { renderApp } from './utils/test-utils/renderApp';
import { MockWorker } from './__mocks__/Worker';

const startDate = 1587574443099;
const play = jest.fn();

HTMLMediaElement.prototype.play = play;
HTMLMediaElement.prototype.pause = jest.fn();

describe('App', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    window.Worker = undefined;
  });

  beforeEach(() => {
    HTMLMediaElement.prototype.play = play;
    window.Worker = MockWorker;
    jest.useFakeTimers('modern');
  });

  it('should run intervals correctly', () => {
    const {
      breakIntervalMinuteInput,
      breakIntervalSecondInput,
      prepTime,
      roundInput,
      startButton,
      workIntervalMinuteInput,
      workIntervalSecondInput,
      getByTestId,
    } = renderApp();

    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();

    const workMinutesValue = '1';
    const workSecondsValue = '1';
    const workMinutes = Number(workMinutesValue);
    const workSeconds = Number(workSecondsValue);

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';
    const breakMinutes = Number(breakMinutesValue);
    const breakSeconds = Number(breakSecondsValue);

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

    fireEvent.click(startButton);

    const timeLeftMinutes = getByTestId('time-left-minutes');
    const timeLeftSeconds = getByTestId('time-left-seconds');

    const round = getByTestId('round');

    const status = getByTestId('status');

    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');

    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(round.textContent).toBe('1/2');
    expect(status.textContent).toBe('WORK');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(status.textContent).toBe('REST');

    expectCountDownFrom({
      minutes: breakMinutes,
      seconds: breakSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(round.textContent).toBe('2/2');
    expect(status.textContent).toBe('WORK');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(play).toHaveBeenCalledTimes(15);
  });

  it('should stop interval when clicking button again', () => {
    const {
      breakIntervalMinuteInput,
      breakIntervalSecondInput,
      prepTime,
      roundInput,
      startButton,
      workIntervalMinuteInput,
      workIntervalSecondInput,
      getByTestId,
    } = renderApp();

    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();

    const workMinutesValue = '1';
    const workSecondsValue = '1';

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

    fireEvent.click(startButton);

    const timeLeftSeconds = getByTestId('time-left-seconds');
    const round = getByTestId('round');
    const status = getByTestId('status');

    expect(round.textContent).toBe('0/2');
    expect(status.textContent).toBe('PREP');

    // count down from 00:05 and stop after two seconds
    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      toSeconds: 3,
      advanceDateNowBy,
      timeLeftMinutes: { value: '00' },
      timeLeftSeconds,
    });

    fireEvent.click(startButton);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it.each`
    case                   | workMinutesValue | workSecondsValue | breakMinutesValue | breakSecondsValue
    ${'work input empty'}  | ${'0'}           | ${'0'}           | ${'1'}            | ${'1'}
    ${'break input empty'} | ${'1'}           | ${'1'}           | ${'0'}            | ${'0'}
  `(
    'should not run when $case',
    ({
      workMinutesValue,
      workSecondsValue,
      breakMinutesValue,
      breakSecondsValue,
    }) => {
      const {
        breakIntervalMinuteInput,
        breakIntervalSecondInput,
        prepTime,
        roundInput,
        startButton,
        workIntervalMinuteInput,
        workIntervalSecondInput,
        getByTestId,
        getByText,
      } = renderApp();

      expect(roundInput).toBeTruthy();
      expect(workIntervalMinuteInput).toBeTruthy();
      expect(workIntervalSecondInput).toBeTruthy();
      expect(breakIntervalMinuteInput).toBeTruthy();
      expect(breakIntervalSecondInput).toBeTruthy();
      expect(startButton).toBeTruthy();

      const roundsValue = '2';

      fireEvent.change(roundInput, { target: { value: roundsValue } });
      fireEvent.blur(roundInput);

      fireEvent.change(workIntervalMinuteInput, {
        target: { value: workMinutesValue },
      });
      fireEvent.change(workIntervalSecondInput, {
        target: { value: workSecondsValue },
      });

      fireEvent.change(breakIntervalMinuteInput, {
        target: { value: breakMinutesValue },
      });
      fireEvent.change(breakIntervalSecondInput, {
        target: { value: breakSecondsValue },
      });

      const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

      fireEvent.click(startButton);

      const timeLeftSeconds = getByTestId('time-left-seconds');
      const round = getByTestId('round');
      const status = getByTestId('status');

      expect(round.textContent).toBe('0/2');
      expect(status.textContent).toBe('PREP');

      // count down from 00:05 and stop after two seconds
      expectCountDownFrom({
        minutes: 0,
        seconds: prepTime,
        advanceDateNowBy,
        timeLeftMinutes: { value: '00' },
        timeLeftSeconds,
      });

      expect(getByText('Start')).toBeTruthy();
    }
  );
});
