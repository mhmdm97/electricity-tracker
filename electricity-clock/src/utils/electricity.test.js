import { describe, it, expect } from 'vitest';
import { generateElectricitySchedule, isElectricityCurrentlyAvailable, getNextElectricityPeriod, getCurrentElectricityPeriod } from './electricity';

describe('Electricity Tracker', () => {
    it('should generate a schedule with default settings', () => {
        const schedule = generateElectricitySchedule();
        expect(schedule.length).toBeGreaterThan(0);
        expect(schedule[0]).toHaveProperty('start');
        expect(schedule[0]).toHaveProperty('end');

        // Verify default cycle (3h on, 6h off -> 9h total)
        const period1 = schedule[0];
        const period2 = schedule[1];
        const diff = period2.start.getTime() - period1.start.getTime();
        expect(diff).toBe(9 * 60 * 60 * 1000);

        const duration = period1.end.getTime() - period1.start.getTime();
        expect(duration).toBe(3 * 60 * 60 * 1000);
    });

    it('should generate a schedule with custom duration settings', () => {
        const config = {
            onDuration: 2,
            offDuration: 4,
            referenceTime: new Date(2026, 1, 7, 12, 0, 0)
        };
        const schedule = generateElectricitySchedule(10, config);

        const period1 = schedule[0];
        const period2 = schedule[1];

        const duration = period1.end.getTime() - period1.start.getTime();
        expect(duration).toBe(2 * 60 * 60 * 1000); // 2 hours

        const diff = period2.start.getTime() - period1.start.getTime();
        expect(diff).toBe((2 + 4) * 60 * 60 * 1000); // 6 hours
    });

    it('should generate a schedule with custom reference time', () => {
        const refTime = new Date();
        refTime.setHours(10, 0, 0, 0); // Today at 10:00

        const config = {
            onDuration: 1,
            offDuration: 1,
            referenceTime: refTime
        };

        const schedule = generateElectricitySchedule(10, config);
        // The schedule should align with the reference time
        // The first period should start at refTime or a multiple of cycle length from it.
        // Since cycle is 2h, and refTime is 10:00.
        // If we run this test at 10:30, it should be 10:00.
        // If we run this test at 12:30, it should be 12:00.

        const start = schedule[0].start;
        const diffFromRef = start.getTime() - refTime.getTime();
        const cycleMs = 2 * 60 * 60 * 1000;

        expect(diffFromRef % cycleMs).toBe(0);
    });

    it('should identify current period correctly', () => {
        // Mock date would be ideal but for simplicity I'll check logic consistency
        // Let's create a fake schedule
        const now = new Date();
        const fakePeriod = {
            start: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
            end: new Date(now.getTime() + 1000 * 60 * 60),   // 1 hour from now
        };
        const schedule = [fakePeriod];

        expect(isElectricityCurrentlyAvailable(schedule)).toBe(true);
        expect(getCurrentElectricityPeriod(schedule)).toBe(fakePeriod);
        expect(getNextElectricityPeriod(schedule)).toBeUndefined();
    });

    it('should identify next period correctly', () => {
        const now = new Date();
        const nextPeriod = {
            start: new Date(now.getTime() + 1000 * 60 * 60), // 1 hour from now
            end: new Date(now.getTime() + 1000 * 60 * 60 * 4),
        };
        const schedule = [nextPeriod];

        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);
        expect(getCurrentElectricityPeriod(schedule)).toBeUndefined();
        expect(getNextElectricityPeriod(schedule)).toBe(nextPeriod);
    });
});
