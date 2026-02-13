
export function generateElectricitySchedule(periodCount = 56, config = {}) {
    const {
        onDuration = 3,
        offDuration = 6,
        referenceTime = new Date(2026, 1, 7, 12, 0, 0)
    } = config;

    const schedule = [];
    const baseStart = new Date(referenceTime);
    const now = new Date();

    const onDurationMs = onDuration * 60 * 60 * 1000;
    const offDurationMs = offDuration * 60 * 60 * 1000;
    const cycleDurationMs = onDurationMs + offDurationMs;

    // Calculate how many full cycles have passed since baseStart
    const diff = now.getTime() - baseStart.getTime();
    let currentStart;

    if (diff >= 0) {
        const cyclesPassed = Math.floor(diff / cycleDurationMs);
        currentStart = new Date(baseStart.getTime() + cyclesPassed * cycleDurationMs);
    } else {
        // baseStart is in the future relative to now
        const cyclesNeeded = Math.ceil(Math.abs(diff) / cycleDurationMs);
        currentStart = new Date(baseStart.getTime() - cyclesNeeded * cycleDurationMs);
    }

    for (let i = 0; i < periodCount; i++) {
        const start = new Date(currentStart);
        const end = new Date(currentStart.getTime() + onDurationMs);

        schedule.push({
            start: start,
            end: end,
            startTime: formatTime(start),
            endTime: formatTime(end),
            date: formatDate(start)
        });

        currentStart = new Date(currentStart.getTime() + cycleDurationMs);
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
