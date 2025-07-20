export interface ElectricitySchedule {
    start: Date;
    end: Date;
}

export interface TimeFrame {
    label: string;
    isAvailable: boolean;
}