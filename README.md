# Electricity Clock Tracker

A modern web application that displays a real-time clock and tracks electricity availability based on a 3-hour ON, 6-hour OFF cycle pattern.

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

Starting reference: July 20, 2025, 6:00 PM - 9:00 PM

## Project Structure

```
electricity-clock/
├── src/
│   ├── index.html                 # Main HTML page
│   ├── styles/
│   │   └── main.css              # CSS styles and responsive design
│   ├── scripts/
│   │   ├── clock.js              # Real-time clock functionality
│   │   └── electricity-tracker.js # Electricity schedule calculator
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── package.json                   # npm dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── .gitignore                    # Git ignore rules
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
   npm start
   ```

4. **Open in browser**:
   - The application will automatically open at `http://localhost:8080`
   - Or manually navigate to `http://localhost:8080`

## Available Scripts

- `npm start` - Starts the development server with live reload
- `npm run build` - Compiles TypeScript files (if using TypeScript features)

## Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Styling with modern features (Grid, Flexbox, Gradients)
- **JavaScript (ES6+)** - Logic and DOM manipulation
- **TypeScript** - Type definitions and enhanced development
- **Live-server** - Development server with hot reload

## How It Works

1. **Schedule Generation**: The app calculates electricity periods based on the fixed pattern starting from a known reference point
2. **Real-time Updates**: Clock updates every second, electricity status updates every minute
3. **Visual Indicators**: 
   - Green highlight for active electricity periods
   - Red indication when electricity is unavailable
   - Timeline showing next 10 upcoming periods

## Customization

To modify the electricity pattern:
1. Edit the base start time in `electricity-tracker.js`
2. Adjust the cycle duration (currently 3h ON, 6h OFF)
3. Modify the number of displayed future periods

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## License

This project is open source and available under the [MIT License](LICENSE).

## Features

- Displays the current time and updates every second.
- Highlights the timeframe when electricity is available.
- Tracks electricity availability based on predefined schedules.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd electricity-clock
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Open `src/index.html` in a web browser to view the application.

## Usage

The application will automatically display the current time and highlight the timeframe when electricity is available. The predefined availability for today is from 9 AM to 12 PM. 

Feel free to modify the electricity availability schedule in the `src/scripts/electricity-tracker.js` file as needed.