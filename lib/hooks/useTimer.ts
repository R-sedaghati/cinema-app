import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

type TimerProps = {
  remainingTime: string;
  resetTimer: () => void;
  setTimer: Dispatch<SetStateAction<number>>;
  timeInNumber: number;
};

const useTimer = (seconds: number, onTimerDone: () => void): TimerProps => {
  const [time, setTime] = useState<number>(seconds);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (time > 0) {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      onTimerDone();
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [time, onTimerDone]);

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
