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
        const interval = setInterval(updateStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [config]);

    if (!status) return null;

    const { isAvailable, currentPeriod, nextPeriod } = status;

    if (isAvailable && currentPeriod) {
        return (
            <div className="status available">
                <div className="status-text">Electricity is available</div>
                <div className="status-detail">Until {currentPeriod.endTime}</div>
            </div>
        );
    } else if (nextPeriod) {
        const timeUntilNext = Math.ceil((nextPeriod.start - new Date()) / (1000 * 60 * 60));
        return (
            <div className="status unavailable">
                <div className="status-text">Electricity is not available</div>
                <div className="status-detail">Next: {nextPeriod.date} {nextPeriod.startTime} (in {timeUntilNext}h)</div>
            </div>
        );
    }

    return null;
}
