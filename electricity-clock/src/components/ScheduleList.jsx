import { useState, useEffect } from 'react';
import { generateElectricitySchedule } from '../utils/electricity';

export function ScheduleList({ config }) {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const updateSchedule = () => {
            const allPeriods = generateElectricitySchedule(56, config);
            setSchedule(allPeriods.slice(0, 10));
        };

        updateSchedule();
        const interval = setInterval(updateSchedule, 60000);
        return () => clearInterval(interval);
    }, [config]);

    const now = new Date();

    return (
        <div id="electricity-schedule" className="schedule-list">
            {schedule.map((period, index) => {
                const isActive = now >= period.start && now < period.end;
                const isPast = now >= period.end;
                let itemClass = '';
                let statusClass = 'status-upcoming';
                let statusText = 'Upcoming';

                if (isActive) {
                    itemClass = 'active';
                    statusClass = 'status-active';
                    statusText = 'Active';
                } else if (isPast) {
                    itemClass = 'past';
                    statusClass = 'status-past';
                    statusText = 'Past';
                }

                return (
                    <div key={index} className={`schedule-item ${itemClass}`}>
                        <div className="period-time-block">
                            <div className="period-date">{period.date}</div>
                            <div className="period-time">{period.startTime} – {period.endTime}</div>
                        </div>
                        <div className={`period-status ${statusClass}`}>{statusText}</div>
                    </div>
                );
            })}
        </div>
    );
}
