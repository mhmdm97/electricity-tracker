
export function generateElectricitySchedule(periodCount = 56) {
    const schedule = [];
    // Fixed reference: Feb 7, 2026, 12:00
    const baseStart = new Date(2026, 1, 7, 12, 0, 0); // Month is 0-based (1 = Feb)
    const now = new Date();

    // Find the most recent ON period start before now
    let currentStart = new Date(baseStart);
    while (currentStart.getTime() + 3 * 60 * 60 * 1000 <= now.getTime()) {
        currentStart = new Date(currentStart.getTime() + 9 * 60 * 60 * 1000);
    }
    // Go back one cycle to ensure we include the current/previous ON period
    while (currentStart > now) {
        currentStart = new Date(currentStart.getTime() - 9 * 60 * 60 * 1000);
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
        currentStart = new Date(currentStart.getTime() + 9 * 60 * 60 * 1000);
    }

    return schedule;
}

function formatTime(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatDate(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
