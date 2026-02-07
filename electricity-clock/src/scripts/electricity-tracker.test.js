import { isElectricityCurrentlyAvailable } from './electricity-tracker.js';

describe('isElectricityCurrentlyAvailable', () => {
    // Manual Date mocking since jest global is not available in ESM without extra setup
    const RealDate = Date;
    let mockedDate = null;

    global.Date = class extends RealDate {
        constructor(...args) {
            if (args.length > 0) {
                return new RealDate(...args);
            }
            return mockedDate || new RealDate();
        }
        static now() {
            return mockedDate ? mockedDate.getTime() : RealDate.now();
        }
    };

    function setSystemTime(date) {
        mockedDate = date;
    }

    afterAll(() => {
        global.Date = RealDate;
    });

    test('should return true when current time is within an electricity period', () => {
        const schedule = [
            { start: new Date('2025-07-20T10:00:00'), end: new Date('2025-07-20T13:00:00') }
        ];
        setSystemTime(new Date('2025-07-20T11:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(true);
    });

    test('should return false when current time is before any electricity period', () => {
        const schedule = [
            { start: new Date('2025-07-20T10:00:00'), end: new Date('2025-07-20T13:00:00') }
        ];
        setSystemTime(new Date('2025-07-20T09:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);
    });

    test('should return false when current time is after all electricity periods', () => {
        const schedule = [
            { start: new Date('2025-07-20T10:00:00'), end: new Date('2025-07-20T13:00:00') }
        ];
        setSystemTime(new Date('2025-07-20T14:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);
    });

    test('should return true at the exact start of a period', () => {
        const schedule = [
            { start: new Date('2025-07-20T10:00:00'), end: new Date('2025-07-20T13:00:00') }
        ];
        setSystemTime(new Date('2025-07-20T10:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(true);
    });

    test('should return false at the exact end of a period', () => {
        const schedule = [
            { start: new Date('2025-07-20T10:00:00'), end: new Date('2025-07-20T13:00:00') }
        ];
        setSystemTime(new Date('2025-07-20T13:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);
    });

    test('should return false for an empty schedule', () => {
        const schedule = [];
        setSystemTime(new Date('2025-07-20T11:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);
    });

    test('should work with multiple periods', () => {
        const schedule = [
            { start: new Date('2025-07-20T06:00:00'), end: new Date('2025-07-20T09:00:00') },
            { start: new Date('2025-07-20T15:00:00'), end: new Date('2025-07-20T18:00:00') }
        ];

        setSystemTime(new Date('2025-07-20T07:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(true);

        setSystemTime(new Date('2025-07-20T12:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(false);

        setSystemTime(new Date('2025-07-20T16:00:00'));
        expect(isElectricityCurrentlyAvailable(schedule)).toBe(true);
    });
});
