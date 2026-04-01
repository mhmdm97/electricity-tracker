import { useState, useEffect, useMemo } from 'react';
import { fromZonedTime } from 'date-fns-tz';
import { Clock } from './components/Clock';
import { Status } from './components/Status';
import { ScheduleList } from './components/ScheduleList';

const DEFAULT_CONFIG = {
    onDuration: 3,
    offDuration: 6,
    referenceTime: fromZonedTime('2026-02-07 12:00:00', 'Asia/Beirut').toISOString()
};

function App() {
    const [config, setConfig] = useState(() => {
        try {
            const saved = localStorage.getItem('electricityConfig');
            return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
        } catch (e) {
            console.error("Failed to parse config", e);
            return DEFAULT_CONFIG;
        }
    });

    useEffect(() => {
        localStorage.setItem('electricityConfig', JSON.stringify(config));
    }, [config]);

    const handleReset = () => {
        setConfig(DEFAULT_CONFIG);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleDateChange = (e) => {
        const localDate = new Date(e.target.value);
        if (!isNaN(localDate.getTime())) {
             setConfig(prev => ({
                ...prev,
                referenceTime: localDate.toISOString()
            }));
        }
    };

    // Format UTC ISO string to Local ISO string (YYYY-MM-DDTHH:mm) for input
    const formatForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const parsedConfig = useMemo(() => ({
        ...config,
        referenceTime: new Date(config.referenceTime)
    }), [config]);

    return (
        <div className="container">
            <div className="clock-container">
                <h1>Current Time</h1>
                <Clock />
                <Status config={parsedConfig} />
            </div>

            <div className="schedule-container">
                <h2>Electricity Schedule</h2>
                <div className="schedule-info">
                    <p>Pattern: {config.onDuration} hours ON, {config.offDuration} hours OFF</p>
                </div>

                <div className="settings-panel" style={{
                    margin: '20px 0',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h3 style={{ marginTop: 0 }}>Settings</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            ON Duration (hours):
                        </label>
                        <input
                            type="number"
                            name="onDuration"
                            value={config.onDuration}
                            onChange={handleChange}
                            min="1"
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100px', color: '#333' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            OFF Duration (hours):
                        </label>
                        <input
                            type="number"
                            name="offDuration"
                            value={config.offDuration}
                            onChange={handleChange}
                            min="1"
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100px', color: '#333' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Reference Start Time (Last known ON time):
                        </label>
                        <input
                            type="datetime-local"
                            name="referenceTime"
                            value={formatForInput(config.referenceTime)}
                            onChange={handleDateChange}
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '250px', color: '#333' }}
                        />
                    </div>
                    <button onClick={handleReset} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Reset to Default
                    </button>
                </div>

                <ScheduleList config={parsedConfig} />
            </div>
        </div>
    );
}

export default App;
