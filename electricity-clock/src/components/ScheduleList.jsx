import { useState, useEffect } from 'react';
import { generateElectricitySchedule } from '../utils/electricity';

export function ScheduleList() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const updateSchedule = () => {
            const allPeriods = generateElectricitySchedule();
            setSchedule(allPeriods.slice(0, 10));
        };

        updateSchedule();
        const interval = setInterval(updateSchedule, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const now = new Date();

    return (
        <div id="electricity-schedule" className="schedule-list">
            {schedule.map((period, index) => {
                const isActive = now >= period.start && now < period.end;
                const isPast = now >= period.end;
                let statusClass = '';
                let statusText = 'Upcoming';

                if (isActive) {
                    statusClass = 'active';
                    statusText = 'Active Now';
                } else if (isPast) {
                    statusClass = 'past';
                    statusText = 'Past';
                }

                return (
                    <div key={index} className={`schedule-item ${statusClass}`}>
                        <div className="period-date">{period.date}</div>
                        <div className="period-time">{period.startTime} - {period.endTime}</div>
                        <div className="period-status">{statusText}</div>
                    </div>
                );
            })}
        </div>
    );
}
