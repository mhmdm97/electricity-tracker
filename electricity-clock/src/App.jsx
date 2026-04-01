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

    const [modalOpen, setModalOpen] = useState(false);
    const [draft, setDraft] = useState(config);

    useEffect(() => {
        localStorage.setItem('electricityConfig', JSON.stringify(config));
    }, [config]);

    const formatForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    };

    const openModal = () => {
        setDraft(config);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleApply = () => {
        setConfig(draft);
        setModalOpen(false);
    };

    const handleReset = () => {
        setDraft(DEFAULT_CONFIG);
        setConfig(DEFAULT_CONFIG);
        setModalOpen(false);
    };

    const handleDraftChange = (e) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleDraftDateChange = (e) => {
        const localDate = new Date(e.target.value);
        if (!isNaN(localDate.getTime())) {
            setDraft(prev => ({ ...prev, referenceTime: localDate.toISOString() }));
        }
    };

    const parsedConfig = useMemo(() => ({
        ...config,
        referenceTime: new Date(config.referenceTime)
    }), [config]);

    return (
        <div className="app-shell">
            {/* Header */}
            <header className="header">
                <span className="header-logo">Luminescent</span>
                <div className="header-actions">
                    <button className="icon-btn" onClick={openModal}>
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="main-content">
                {/* Clock */}
                <div className="clock-section">
                    <Clock />
                    <Status config={parsedConfig} />
                </div>

                {/* Action buttons */}
                <div className="action-buttons">
                    <button className="action-btn action-btn-secondary" onClick={openModal}>
                        <span className="material-symbols-outlined">tune</span>
                        Update Schedule
                    </button>
                </div>

                {/* Schedule */}
                <div className="schedule-section">
                    <div className="schedule-section-header">
                        <span className="schedule-section-title">Electricity Schedule</span>
                        <span className="schedule-pattern-badge">
                            {config.onDuration}h ON / {config.offDuration}h OFF
                        </span>
                    </div>
                    <ScheduleList config={parsedConfig} />
                </div>
            </main>

            {/* Settings Modal */}
            <div
                className={`modal-overlay${modalOpen ? ' open' : ''}`}
                onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
                <div className="modal-panel">
                    <div className="modal-header">
                        <span className="modal-title">Configuration</span>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="form-field">
                        <label className="form-label">On Duration (Hours)</label>
                        <input
                            className="form-input"
                            type="number"
                            name="onDuration"
                            value={draft.onDuration}
                            onChange={handleDraftChange}
                            min="1"
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Off Duration (Hours)</label>
                        <input
                            className="form-input"
                            type="number"
                            name="offDuration"
                            value={draft.offDuration}
                            onChange={handleDraftChange}
                            min="1"
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Reference Start Time</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            name="referenceTime"
                            value={formatForInput(draft.referenceTime)}
                            onChange={handleDraftDateChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button className="btn-ghost" onClick={handleReset}>
                            Reset
                        </button>
                        <button className="btn-ghost" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="btn-primary" onClick={handleApply}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
