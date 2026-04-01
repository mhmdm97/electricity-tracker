import { useState, useEffect } from 'react';
import {
    generateElectricitySchedule,
    isElectricityCurrentlyAvailable,
    getCurrentElectricityPeriod,
    getNextElectricityPeriod
} from '../utils/electricity';

export function Status({ config }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const updateStatus = () => {
            const schedule = generateElectricitySchedule(56, config);
            const isAvailable = isElectricityCurrentlyAvailable(schedule);
            const currentPeriod = getCurrentElectricityPeriod(schedule);
            const nextPeriod = getNextElectricityPeriod(schedule);

            setStatus({ isAvailable, currentPeriod, nextPeriod });
        };

        updateStatus();
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, [config]);

    if (!status) return null;

    const { isAvailable, currentPeriod, nextPeriod } = status;

    if (isAvailable && currentPeriod) {
        return (
            <div className="status-section">
                <span className="status-label">Power Status</span>
                <div className="status available">
                    <span className="material-symbols-outlined">light_mode</span>
                    Power Cycle On
                </div>
                <div className="status-detail">Until {currentPeriod.endTime}</div>
            </div>
        );
    } else if (nextPeriod) {
        const timeUntilNext = Math.ceil((nextPeriod.start - new Date()) / (1000 * 60 * 60));
        return (
            <div className="status-section">
                <span className="status-label">Power Status</span>
                <div className="status unavailable">
                    <span className="material-symbols-outlined">nights_stay</span>
                    Power Cycle Off
                </div>
                <div className="status-detail">
                    Next: {nextPeriod.date} {nextPeriod.startTime} (in {timeUntilNext}h)
                </div>
            </div>
        );
    }

    return null;
}
