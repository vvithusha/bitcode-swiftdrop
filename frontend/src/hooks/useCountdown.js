import { useEffect, useMemo, useState } from 'react';

const formatTime = (targetMs) => {
  const total = Math.max(0, targetMs);
  const seconds = Math.floor(total / 1000) % 60;
  const minutes = Math.floor(total / (1000 * 60)) % 60;
  const hours = Math.floor(total / (1000 * 60 * 60));
  return { hours, minutes, seconds, total };
};

export const useCountdown = (scheduledAt) => {
  const target = useMemo(() => new Date(scheduledAt).getTime(), [scheduledAt]);
  const [remaining, setRemaining] = useState(() => formatTime(target - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatTime(target - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return remaining;
};
