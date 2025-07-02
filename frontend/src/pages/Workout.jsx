import React, { useState } from 'react';
import Navbar1 from '../components/navigation/Navbar1';
import '../styles/components/workout.css';
import { 
  FiTrendingUp, 
  FiClock, 
  FiHeart, 
  FiCalendar,
  FiActivity
} from 'react-icons/fi';
import axios from 'axios';

const Workout = ({ darkMode, toggleDarkMode }) => {
  // Sample data for workout stats
  const workoutStats = [
    {
      title: 'Steps',
      value: 8432,
      icon: <FiActivity />,
      change: '+12%',
      isPositive: true
    },
    {
      title: 'Distance',
      value: 5.7,
      unit: 'km',
      icon: <FiTrendingUp />,
      change: '+5%',
      isPositive: true
    },
    {
      title: 'Calories',
      value: 420,
      icon: <FiHeart />,
      change: '-3%',
      isPositive: false
    },
    {
      title: 'Active Time',
      value: 45,
      unit: 'min',
      icon: <FiClock />,
      change: '+8%',
      isPositive: true
    }
  ];

  // State for workout history and new entry
  const [workoutHistory, setWorkoutHistory] = useState([
    { id: 1, date: '2023-05-15', type: 'running', duration: 45, distance: 5.2, measure: 'km', actualDistance: 0, actualWeight: 0, progress: 0 },
    { id: 2, date: '2023-05-14', type: 'cycling', duration: 60, distance: 15.8, measure: 'km', actualDistance: 0, actualWeight: 0, progress: 0 },
    { id: 3, date: '2023-05-12', type: 'walking', duration: 30, distance: 2.5, measure: 'km', actualDistance: 0, actualWeight: 0, progress: 0 },
    { id: 4, date: '2023-05-10', type: 'weight lifting', duration: 50, weight: 80, measure: 'kg', actualDistance: 0, actualWeight: 0, progress: 0 },
  ]);

  // State for weekly progress
  const [weeklyProgress, setWeeklyProgress] = useState({
    calories: [420, 580, 210, 490, 320, 380, 410], // Keeping for stats, but not in recent
    distance: [5.2, 15.8, 2.5, 6.1, 3.8, 4.5, 5.2], // Updated to reflect distance/weight
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });

  // State for new workout form
  const [newWorkout, setNewWorkout] = useState({
    date: '',
    type: '',
    duration: '',
    distance: '', // Used for distance-based workouts
    weight: '',  // Used for weight lifting
    measure: ''  // Dynamically set based on type
  });

  // State for updating progress
  const [updatingWorkoutId, setUpdatingWorkoutId] = useState(null);
  const [actualValue, setActualValue] = useState('');

  // Format time for display
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        updated.measure = value.toLowerCase() === 'weight lifting' ? 'kg' : 'km';
        updated.distance = value.toLowerCase() === 'weight lifting' ? '' : updated.distance;
        updated.weight = value.toLowerCase() === 'weight lifting' ? updated.weight : '';
      }
      return updated;
    });
  };

  // Handle new workout submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let measure = newWorkout.measure;
    let value = newWorkout.distance || newWorkout.weight;

    if (!measure || !value) {
      alert('Please ensure all fields are filled correctly based on workout type.');
      return;
    }

    const newEntry = {
      date: newWorkout.date,
      type: newWorkout.type.toLowerCase(),
      duration: parseInt(newWorkout.duration) || 0,
      ...(measure === 'km' ? { distance: parseFloat(value) || 0 } : { weight: parseInt(value) || 0 }),
      measure,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/workouts',
        newEntry,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkoutHistory((prev) => [...prev, response.data]);
      setNewWorkout({ date: '', type: '', duration: '', distance: '', weight: '', measure: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add workout');
    }
  };

  // Handle progress update
  const handleProgressUpdate = (id) => {
    const actual = parseFloat(actualValue) || 0;
    setWorkoutHistory((prev) => {
      const workout = prev.find(w => w.id === id);
      let progress = 0;
      if (workout.measure === 'km' && workout.distance > 0) {
        progress = Math.min((actual / workout.distance) * 100, 100);
      } else if (workout.measure === 'kg' && workout.weight > 0) {
        progress = Math.min((actual / workout.weight) * 100, 100);
      }
      return prev.map(w => 
        w.id === id ? { ...w, actualDistance: workout.measure === 'km' ? actual : w.actualDistance, actualWeight: workout.measure === 'kg' ? actual : w.actualWeight, progress } : w
      );
    });
    setUpdatingWorkoutId(null);
    setActualValue('');
  };

  return (
    <div className={`workout-page ${darkMode ? 'dark' : ''}`}>
      <Navbar1 showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="workout-container">
        <div className="workout-header">
          <h1>Workout Stats</h1>
          <p>View your fitness activities and progress</p>
        </div>

        <div className="workout-grid">
          {/* Stats Overview Section - Matching Nutrition Page Style */}
          <div className="stats-grid">
            {workoutStats.map((stat, index) => (
              <div key={index} className="health-metric card">
                <div className="metric-header">
                  <div className="metric-icon">{stat.icon}</div>
                  <h3>{stat.title}</h3>
                </div>
                <div className="metric-content">
                  <p className="metric-value">
                    {stat.value}
                    {stat.unit && <span> {stat.unit}</span>}
                  </p>
                  <div className={`metric-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

{/* Add Workout Section */}
<div className="add-workout-card card">
            <h2><FiActivity /> Add New Workout</h2>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newWorkout.date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type:</label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={newWorkout.type}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., running, weight lifting"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration:</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={newWorkout.duration}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 45"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="distance">Distance (km) / Weight (kg):</label>
                  <input
                    type="number"
                    step={newWorkout.type.toLowerCase() === 'weight lifting' ? '1' : '0.1'}
                    id="distance"
                    name="distance"
                    value={newWorkout.distance}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={newWorkout.type.toLowerCase() === 'weight lifting' ? 'e.g., 80' : 'e.g., 5.2'}
                    disabled={newWorkout.type.toLowerCase() === 'weight lifting'}
                    required={newWorkout.type.toLowerCase() !== 'weight lifting'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg):</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={newWorkout.weight}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 80"
                    disabled={newWorkout.type.toLowerCase() !== 'weight lifting'}
                    required={newWorkout.type.toLowerCase() === 'weight lifting'}
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Workout</button>
            </form>
          </div>
          {/* Workout History Section */}
          <div className="history-card card">
            <div className="history-header">
              <h2><FiCalendar /> Recent Workouts</h2>
              
            </div>
            <div className="history-list">
              {workoutHistory.map(workout => (
                <div key={workout.id} className="workout-item">
                  <div className="workout-date">{workout.date}</div>
                  <div className="workout-type">{workout.type}</div>
                  <div className="workout-stats">
                    <span>{formatTime(workout.duration)}</span>
                    <span>{workout.distance || workout.weight} {workout.measure}</span>
                  </div>
                  <div className="workout-progress">
                    <span>Progress: {typeof workout.progress === 'number' ? workout.progress.toFixed(1) : '--'}%</span>
                  </div>
                  <button
                    onClick={() => {
                      setUpdatingWorkoutId(workout.id);
                      setActualValue(workout.measure === 'km' ? workout.actualDistance : workout.actualWeight);
                    }}
                    className="progress-update-btn"
                    style={{ position: 'absolute', right: '10px', top: '10px' }}
                  >
                    Update Progress
                  </button>
                  {updatingWorkoutId === workout.id && (
                    <div className="progress-form">
                      <form onSubmit={(e) => { e.preventDefault(); handleProgressUpdate(workout.id); }}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>
                              How much {workout.measure} did you {workout.measure === 'km' ? 'travel' : 'lift'} out of {workout.distance || workout.weight} {workout.measure}?
                            </label>
                            <input
                              type="number"
                              step={workout.measure === 'km' ? '0.1' : '1'}
                              value={actualValue}
                              onChange={(e) => setActualValue(e.target.value)}
                              className="progress-input"
                              placeholder={`Enter actual ${workout.measure}`}
                              required
                            />
                          </div>
                        </div>
                        <button type="submit" className="progress-save">Save</button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatingWorkoutId(null);
                            setActualValue('');
                          }}
                          className="progress-cancel"
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Charts Section */}
          <div className="progress-card card">
            <h2><FiTrendingUp /> Weekly Progress</h2>
            <div className="progress-chart">
              <div className="chart-container">
                <h3>Calories Burned</h3>
                <div className="chart-bars" style={{ justifyContent: 'space-between' }}>
                  {weeklyProgress.calories.map((value, index) => (
                    <div 
                      key={index} 
                      className="chart-bar" 
                      style={{ height: `${(value / 600) * 100}%`, width: '10%' }}
                    >
                      <span className="bar-value">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels" style={{ justifyContent: 'space-between', padding: '5px 0' }}>
                
                </div>
              </div>
              <div className="chart-container">
                <h3>Distance Covered</h3>
                <div className="chart-bars" style={{ justifyContent: 'space-between' }}>
                  {weeklyProgress.distance.map((value, index) => (
                    <div 
                      key={index} 
                      className="chart-bar" 
                      style={{ height: `${(value / 16) * 100}%`, width: '10%' }}
                    >
                      <span className="bar-value">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels" style={{ justifyContent: 'space-between', padding: '5px 0' }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workout;