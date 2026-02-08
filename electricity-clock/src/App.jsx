import { Clock } from './components/Clock';
import { Status } from './components/Status';
import { ScheduleList } from './components/ScheduleList';

function App() {
  return (
    <div className="container">
        <div className="clock-container">
            <h1>Current Time</h1>
            <Clock />
            <Status />
        </div>

        <div className="schedule-container">
            <h2>Electricity Schedule</h2>
            <div className="schedule-info">
                <p>Pattern: 3 hours ON, 6 hours OFF (repeating cycle)</p>
            </div>
            <ScheduleList />
        </div>
    </div>
  );
}

export default App;
