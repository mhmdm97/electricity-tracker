import { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Beirut';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = formatInTimeZone(time, TIMEZONE, 'HH:mm:ss');

  return (
    <div className="clock-ring-wrapper">
      <div className="clock-ring-inner">
        <div id="clock" className="clock">
          {timeString}
        </div>
      </div>
    </div>
  );
}
