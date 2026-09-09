import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

type TimerProps = {
  remainingTime: string;
  resetTimer: () => void;
  setTimer: Dispatch<SetStateAction<number>>;
  timeInNumber: number;
};

const useTimer = (seconds: number, onTimerDone: () => void): TimerProps => {
  const [time, setTime] = useState<number>(seconds);

  // Callers pass an inline arrow, so keeping `onTimerDone` in the effect's deps would
  // tear the interval down and restart it on every render — the countdown then stalls
  // for as long as the user keeps typing.
  const onTimerDoneRef = useRef(onTimerDone);

  useEffect(() => {
    onTimerDoneRef.current = onTimerDone;
  }, [onTimerDone]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => (prevTime <= 0 ? 0 : prevTime - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Fire from an effect, not from the updater above — updaters must stay pure.
  useEffect(() => {
    if (time === 0) onTimerDoneRef.current();
  }, [time]);

  const formatTime = (): string => {
    const minutes: number = Math.floor(time / 60);
    const second: number = time % 60;
    const formattedMinutes: string = minutes.toString().padStart(2, '0');
    const formattedSeconds: string = second.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const resetTimer = (): void => {
    setTime(seconds);
  };

  return {
    remainingTime: formatTime(),
    resetTimer,
    setTimer: setTime,
    timeInNumber: time,
  };
};

export default useTimer;
