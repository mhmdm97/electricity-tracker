import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Beirut';

export function generateElectricitySchedule(periodCount = 56, now = new Date()) {
    const schedule = [];
    // Fixed reference: Feb 7, 2026, 12:00 in Asia/Beirut
    // This creates a UTC Date object corresponding to that local time
    const baseStart = fromZonedTime('2026-02-07 12:00:00', TIMEZONE);

    // Find the most recent ON period start before now
    let currentStart = new Date(baseStart);
    // 9 hours in milliseconds
    const CYCLE_DURATION = 9 * 60 * 60 * 1000;

    // If baseStart is in the future relative to now, we need to go back?
    // Or if baseStart is far in the past.
    // The loop logic below assumes baseStart < now or handles it.

    // If baseStart is > now, we should subtract 9h until we are just before now?
    // Or if baseStart is < now, add 9h until we are just before now.

    // Original logic:
    // while (currentStart + 3h <= now) add 9h
    // This works if currentStart starts way back.
    // But baseStart is Feb 7 2026.
    // If now is Feb 13 2026, it will add.

    // We need to handle moving backwards if baseStart is in the future?
    // No, baseStart is fixed. If user runs this in 2025, baseStart is future.
    // Then the loop: `currentStart.getTime() + 3h <= now.getTime()` is false immediately.
    // Then `while (currentStart > now)` will run.
    // It subtracts 9h.
    // So logic is fine for both directions.

    while (currentStart.getTime() + 3 * 60 * 60 * 1000 <= now.getTime()) {
        currentStart = new Date(currentStart.getTime() + CYCLE_DURATION);
    }
    // Go back one cycle to ensure we include the current/previous ON period
    while (currentStart > now) {
        currentStart = new Date(currentStart.getTime() - CYCLE_DURATION);
    }

    for (let i = 0; i < periodCount; i++) {
        const start = new Date(currentStart);
        const end = new Date(currentStart.getTime() + 3 * 60 * 60 * 1000); // 3 hours ON

        schedule.push({
            start: start,
            end: end,
            startTime: formatTime(start),
            endTime: formatTime(end),
            date: formatDate(start)
        });

        // Next ON period is 9 hours later
        currentStart = new Date(currentStart.getTime() + CYCLE_DURATION);
    }

    return schedule;
}

function formatTime(date) {
    return formatInTimeZone(date, TIMEZONE, 'HH:mm');
}

function formatDate(date) {
    return formatInTimeZone(date, TIMEZONE, 'dd/MM/yyyy');
}

export function isElectricityCurrentlyAvailable(schedule) {
    const now = new Date();
    return schedule.some(period => now >= period.start && now < period.end);
}

export function getNextElectricityPeriod(schedule) {
    const now = new Date();
    return schedule.find(period => period.start > now);
}

export function getCurrentElectricityPeriod(schedule) {
    const now = new Date();
    return schedule.find(period => now >= period.start && now < period.end);
}
