import { describe, it, expect } from 'vitest';
import { generateElectricitySchedule, isElectricityCurrentlyAvailable, getNextElectricityPeriod, getCurrentElectricityPeriod } from './electricity';

describe('Electricity Tracker', () => {
    it('should generate a schedule', () => {
        const schedule = generateElectricitySchedule();
        expect(schedule.length).toBeGreaterThan(0);
        expect(schedule[0]).toHaveProperty('start');
        expect(schedule[0]).toHaveProperty('end');
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
