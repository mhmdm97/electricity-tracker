
function generateElectricitySchedule() {
    const schedule = [];
    const today = new Date();
    
    // Today's electricity is available 18:00-21:00 (6pm-9pm)
    const baseStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0);
    
    // Generate schedule for next 7 days
    let currentStart = new Date(baseStart);
    
    for (let i = 0; i < 56; i++) { // 8 cycles per day * 7 days
        const start = new Date(currentStart);
        const end = new Date(currentStart.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours
        
        schedule.push({
            start: start,
            end: end,
            startTime: formatTime(start),
            endTime: formatTime(end),
            date: formatDate(start)
        });
        
        // Next cycle starts 9 hours later (3 hours on + 6 hours off)
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

function isElectricityCurrentlyAvailable(schedule) {
    const now = new Date();
    return schedule.some(period => now >= period.start && now < period.end);
}

function getNextElectricityPeriod(schedule) {
    const now = new Date();
    return schedule.find(period => period.start > now);
}

function getCurrentElectricityPeriod(schedule) {
    const now = new Date();
    return schedule.find(period => now >= period.start && now < period.end);
}

function displayElectricitySchedule() {
    const schedule = generateElectricitySchedule();
    const scheduleContainer = document.getElementById('electricity-schedule');
    
    if (!scheduleContainer) return;
    
    scheduleContainer.innerHTML = '';
    
    // Show next 10 periods
    const upcomingPeriods = schedule.slice(0, 10);
    
    upcomingPeriods.forEach((period, index) => {
        const periodElement = document.createElement('div');
        periodElement.className = 'schedule-item';
        
        const now = new Date();
        const isActive = now >= period.start && now < period.end;
        const isPast = now >= period.end;
        
        if (isActive) {
            periodElement.classList.add('active');
        } else if (isPast) {
            periodElement.classList.add('past');
        }
        
        periodElement.innerHTML = `
            <div class="period-date">${period.date}</div>
            <div class="period-time">${period.startTime} - ${period.endTime}</div>
            <div class="period-status">${isActive ? 'Active Now' : isPast ? 'Past' : 'Upcoming'}</div>
        `;
        
        scheduleContainer.appendChild(periodElement);
    });
}

export function trackElectricity() {
    const schedule = generateElectricitySchedule();
    const isAvailable = isElectricityCurrentlyAvailable(schedule);
    const currentPeriod = getCurrentElectricityPeriod(schedule);
    const nextPeriod = getNextElectricityPeriod(schedule);
    
    const displayElement = document.getElementById('electricity-status');
    if (displayElement) {
        if (isAvailable && currentPeriod) {
            displayElement.innerHTML = `
                <div class="status-text">Electricity is available</div>
                <div class="status-detail">Until ${currentPeriod.endTime}</div>
            `;
            displayElement.className = 'status available';
        } else if (nextPeriod) {
            const timeUntilNext = Math.ceil((nextPeriod.start - new Date()) / (1000 * 60 * 60));
            displayElement.innerHTML = `
                <div class="status-text">Electricity is not available</div>
                <div class="status-detail">Next: ${nextPeriod.date} ${nextPeriod.startTime} (in ${timeUntilNext}h)</div>
            `;
            displayElement.className = 'status unavailable';
        }
    }
    
    displayElectricitySchedule();
}