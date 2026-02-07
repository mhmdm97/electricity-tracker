# Electricity Clock Tracker (React)

A modern web application that displays a real-time clock and tracks electricity availability based on a 3-hour ON, 6-hour OFF cycle pattern. Built with React and Vite.

## Features

- **Real-time Clock**: Live digital clock with seconds precision
- **Electricity Status**: Visual indicator showing current electricity availability
- **Schedule Display**: Shows upcoming electricity periods with dates and times
- **Automatic Pattern Calculation**: Calculates future periods based on the repeating cycle
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with gradient backgrounds and smooth animations

## Electricity Pattern

The application tracks electricity based on this pattern:
- **3 hours ON** - Electricity available
- **6 hours OFF** - No electricity
- **Repeating cycle** - Pattern continues indefinitely

Starting reference: Feb 7, 2026, 12:00

## Project Structure

```
electricity-clock/
├── src/
│   ├── components/
│   │   ├── Clock.jsx             # Real-time clock component
│   │   ├── Status.jsx            # Electricity status component
│   │   └── ScheduleList.jsx      # Schedule display component
│   ├── utils/
│   │   └── electricity.js        # Electricity schedule logic
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Entry point
├── package.json                  # npm dependencies and scripts
├── vite.config.js                # Vite configuration
└── README.md                     # Project documentation
```

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd electricity-clock
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The application will automatically be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run lint` - Runs ESLint
- `npm test` - Runs unit tests

## Technologies Used

- **React** - UI Library
- **Vite** - Build tool and development server
- **CSS3** - Styling
- **Vitest** - Unit testing

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers
