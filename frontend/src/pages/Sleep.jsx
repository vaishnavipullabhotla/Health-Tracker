import React, { useState, useEffect } from 'react';
import Navbar from '../components/navigation/Navbar1';
import '../styles/components/sleep.css';
import { FiClock, FiZap } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Sample fallback data
const sleepHoursData = [6.5, 7.0, 7.5, 6.8, 7.2, 8.0, 7.3]; // Hours slept each day (Mon-Sun)
const sleepStagesData = {
  deep: [25, 26, 24, 27, 26, 28, 26], // Deep sleep percentages
  rem: [30, 28, 29, 27, 30, 29, 28],  // REM sleep percentages
  light: [45, 46, 47, 46, 44, 43, 46], // Light sleep percentages
};

const Sleep = ({ darkMode, toggleDarkMode }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // State for current day's input and history
  const [sleepHours, setSleepHours] = useState('');
  const [sleepStages, setSleepStages] = useState({ deep: '', rem: '', light: '' });
  const [healthTips, setHealthTips] = useState('');
  const [sleepHistory, setSleepHistory] = useState(() => {
    const saved = localStorage.getItem('sleepHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('sleepHistory', JSON.stringify(sleepHistory));
  }, [sleepHistory]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const hours = parseFloat(sleepHours);
    const deep = parseInt(sleepStages.deep) || 0;
    const rem = parseInt(sleepStages.rem) || 0;
    const light = parseInt(sleepStages.light) || 0;
    const totalStages = deep + rem + light;

    if (hours <= 0 || totalStages !== 100) {
      setHealthTips('Please ensure sleep hours are positive and stages sum to 100%.');
      return;
    }

    const newEntry = { date: new Date().toLocaleDateString(), hours, deep, rem, light };
    setSleepHistory((prev) => [...prev.slice(-6), newEntry]); // Keep last 7 days
    setSleepHours('');
    setSleepStages({ deep: '', rem: '', light: '' });
    generateHealthTips(hours);
  };


  const generateHealthTips = (hours) => {
    if (hours < 6) {
      setHealthTips(
        'Tip: You’re sleeping less than 6 hours! Consider a consistent bedtime routine and reducing screen time before bed to improve rest.'
      );
    } else if (hours < 7) {
      setHealthTips(
        'Tip: Aim for 7-9 hours of sleep. A short nap (20-30 mins) during the day might help boost energy.'
      );
    } else if (hours <= 9) {
      setHealthTips('Great job! Your 7-9 hours of sleep supports good health. Maintain a relaxing pre-sleep ritual.');
    } else {
      setHealthTips(
        'Tip: Sleeping over 9 hours might indicate oversleeping. Try light exercise or limit naps to balance your schedule.'
      );
    }
  };

  // Calculate average sleep time from history
  const averageSleepTime = sleepHistory.length
    ? (sleepHistory.reduce((sum, entry) => sum + entry.hours, 0) / sleepHistory.length).toFixed(1)
    : 0;
  const sleepQuality = Math.min(100, Math.round((averageSleepTime / 9) * 100));

  // Chart data for sleep hours
  const sleepHoursChartData = {
    labels: sleepHistory.map((entry) => entry.date).reverse().slice(0, 7) || days,
    datasets: [
      {
        label: 'Sleep Hours',
        data: sleepHistory.map((entry) => entry.hours).reverse().slice(0, 7) || sleepHoursData,
        fill: true,
        backgroundColor: darkMode ? 'rgba(123, 107, 255, 0.2)' : 'rgba(155, 89, 182, 0.2)',
        borderColor: darkMode ? '#7b6bff' : '#9b59b6',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Chart data for sleep stages
  const sleepStagesChartData = {
    labels: sleepHistory.map((entry) => entry.date).reverse().slice(0, 7) || days,
    datasets: [
      {
        label: 'Deep',
        data: sleepHistory.map((entry) => entry.deep).reverse().slice(0, 7) || sleepStagesData.deep,
        backgroundColor: darkMode ? '#7b6bff' : '#4a90e2',
      },
      {
        label: 'REM',
        data: sleepHistory.map((entry) => entry.rem).reverse().slice(0, 7) || sleepStagesData.rem,
        backgroundColor: darkMode ? '#b19cd9' : '#9b59b6',
      },
      {
        label: 'Light',
        data: sleepHistory.map((entry) => entry.light).reverse().slice(0, 7) || sleepStagesData.light,
        backgroundColor: darkMode ? '#34c759' : '#2ecc71',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: darkMode ? '#b0b0b0' : '#718096' } },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12,
        ticks: { color: darkMode ? '#b0b0b0' : '#718096' },
      },
      x: { ticks: { color: darkMode ? '#b0b0b0' : '#718096' } },
    },
  };

  return (
    <div className={`sleep-page ${darkMode ? 'dark' : ''}`}>
      <Navbar showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="sleep-container">
        <div className="sleep-header">
          <h1 className="sleep-title">Sleep</h1>
          <p className="sleep-subtitle">Track your sleep patterns and quality</p>
        </div>

        {/* Enter Today's Sleep Data Section */}
        <div className="sleep-card sleep-input-section">
          <h3>Enter Today’s Sleep Data</h3>
          <form onSubmit={handleSubmit} className="sleep-form">
            <div className="sleep-form-row">
              <div className="sleep-form-group">
                <label className="sleep-label">Hours Slept:</label>
                <input
                  type="number"
                  step="0.1"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="sleep-input"
                  placeholder="e.g., 7.5"
                  required
                />
              </div>
              <div className="sleep-form-group">
                <label className="sleep-label">Deep (%):</label>
                <input
                  type="number"
                  value={sleepStages.deep}
                  onChange={(e) => setSleepStages((prev) => ({ ...prev, deep: e.target.value }))}
                  className="sleep-input"
                  placeholder="e.g., 25"
                  required
                />
              </div>
              <div className="sleep-form-group">
                <label className="sleep-label">REM (%):</label>
                <input
                  type="number"
                  value={sleepStages.rem}
                  onChange={(e) => setSleepStages((prev) => ({ ...prev, rem: e.target.value }))}
                  className="sleep-input"
                  placeholder="e.g., 30"
                  required
                />
              </div>
              <div className="sleep-form-group">
                <label className="sleep-label">Light (%):</label>
                <input
                  type="number"
                  value={sleepStages.light}
                  onChange={(e) => setSleepStages((prev) => ({ ...prev, light: e.target.value }))}
                  className="sleep-input"
                  placeholder="e.g., 45"
                  required
                />
              </div>
            </div>
            <button type="submit" className="sleep-btn-primary">
              Save
            </button>
          </form>
          {healthTips && <p className="sleep-tips">{healthTips}</p>}
        </div>

        {/* Sleep Metrics */}
        <div className="sleep-grid">
          <div className="sleep-metric sleep-card">
            <div className="sleep-metric-header">
              <FiClock className="sleep-metric-icon" />
              <h3>Average Sleep Time</h3>
            </div>
            <div className="sleep-metric-content">
              <p className="sleep-metric-value">
                {averageSleepTime} <span>hours</span>
              </p>
              <span className="sleep-metric-change">Last 7 days</span>
            </div>
          </div>

          <div className="sleep-metric sleep-card">
            <div className="sleep-metric-header">
              <FiZap className="sleep-metric-icon" />
              <h3>Sleep Quality</h3>
            </div>
            <div className="sleep-metric-content">
              <p className="sleep-metric-value">{sleepQuality} / 100</p>
              <span className="sleep-metric-change positive">{sleepQuality >= 80 ? 'Good' : 'Fair'}</span>
            </div>
          </div>

          <div className="sleep-metric sleep-card">
            <div className="sleep-metric-header">
              <h3>Sleep Stages</h3>
            </div>
            <div className="sleep-metric-content sleep-stages">
              <div className="stage-item">
                <span className="stage-color deep"></span>
                <span>Deep</span>
                <span className="stage-value">
                  {sleepHistory.length ? sleepHistory[sleepHistory.length - 1]?.deep : 26}%
                </span>
              </div>
              <div className="stage-item">
                <span className="stage-color rem"></span>
                <span>REM</span>
                <span className="stage-value">
                  {sleepHistory.length ? sleepHistory[sleepHistory.length - 1]?.rem : 29}%
                </span>
              </div>
              <div className="stage-item">
                <span className="stage-color light"></span>
                <span>Light</span>
                <span className="stage-value">
                  {sleepHistory.length ? sleepHistory[sleepHistory.length - 1]?.light : 45}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Analysis */}
        <div className="sleep-analysis sleep-card">
          <h2>Sleep Analysis</h2>
          <div className="sleep-graph-container" style={{ height: '300px' }}>
            <Line data={sleepHoursChartData} options={chartOptions} />
          </div>
        </div>

        {/* Sleep Stages Breakdown */}
        <div className="sleep-stages-breakdown sleep-card">
          <h2>Sleep Stages Breakdown</h2>
          <div className="sleep-graph-container" style={{ height: '300px' }}>
            <Bar data={sleepStagesChartData} options={{ ...chartOptions, scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleep;