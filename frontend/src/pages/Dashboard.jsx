import React, { useState, useEffect } from 'react';
import Navbar from '../components/navigation/Navbar1';
import '../styles/components/dashboard.css';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaHeartbeat, FaWalking, FaRunning, FaBiking, FaFire } from 'react-icons/fa';
import { GiFootsteps } from 'react-icons/gi';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- DYNAMIC DATA ENGINE ---

const getRandom = (min, max, decimals = 0) => {
  return (Math.random() * (max - min) + min).toFixed(decimals);
};

// This function generates a complete set of dynamic data for the entire dashboard
const generateDynamicDashboardData = () => {
    const calorieGoal = 2500;
    const proteinGoal = 120;
    const carbsGoal = 275;
    const fatGoal = 85;

    const calories = parseInt(getRandom(1700, calorieGoal));
    const protein = parseInt(getRandom(90, proteinGoal));
    const carbs = parseInt(getRandom(200, carbsGoal));
    const fat = parseInt(getRandom(60, fatGoal));
    
    const totalMacros = protein + carbs + fat;
    const currentBpm = parseInt(getRandom(65, 85));

    return {
        // Main Metrics
        heartRate: currentBpm,
        steps: parseInt(getRandom(6000, 15000)),
        calories,
        calorieGoal,
        
        // Nutrition Metrics
        protein,
        proteinGoal,
        carbs,
        carbsGoal,
        fat,
        fatGoal,

        // Nutrition Pie Chart Data
        nutritionPie: {
            protein: Math.round((protein / totalMacros) * 100),
            carbs: Math.round((carbs / totalMacros) * 100),
            fat: Math.round((fat / totalMacros) * 100),
        },

        // Chart Data
        weeklyActivityData: Array.from({ length: 7 }, () => getRandom(1700, 3000)),
        sleepData: Array.from({ length: 7 }, () => getRandom(6, 9, 1)),
        heartRateData: Array.from({ length: 24 }, () => getRandom(60, 100)),
    };
};

const Dashboard = ({ darkMode, toggleDarkMode }) => {
    const [dashboardData, setDashboardData] = useState(generateDynamicDashboardData());

    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardData(generateDynamicDashboardData());
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    // --- CHART CONFIGURATIONS ---

    const activityChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Calories Burned (kcal)',
            data: dashboardData.weeklyActivityData,
            backgroundColor: darkMode ? '#7b6bff' : '#4299e1',
        }],
    };

    const sleepChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Sleep Hours',
            data: dashboardData.sleepData,
            fill: true,
            backgroundColor: darkMode ? 'rgba(123, 107, 255, 0.2)' : 'rgba(159, 122, 234, 0.2)',
            borderColor: darkMode ? '#b19cd9' : '#9f7aea',
            borderWidth: 2,
            tension: 0.4,
        }],
    };
    
    const heartRateChartData = {
        labels: [
            '12AM', '4AM', '8AM', '12PM', '4PM', '8PM', '12AM'
        ],
        datasets: [{
            label: 'Heart Rate',
            data: [
                dashboardData.heartRateData[0],
                dashboardData.heartRateData[4],
                dashboardData.heartRateData[8],
                dashboardData.heartRateData[12],
                dashboardData.heartRateData[16],
                dashboardData.heartRateData[20],
                dashboardData.heartRateData[23]
            ],
            borderColor: '#4f8cff',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#4f8cff',
            tension: 0.45,
            fill: false,
        }]
    };

    const heartRateChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: ctx => `${ctx.parsed.y} BPM`
                }
            }
        },
        scales: {
            y: {
                min: 50,
                max: 100,
                ticks: {
                    color: darkMode ? '#b0b0b0' : '#718096',
                    stepSize: 20,
                    font: { size: 14 }
                },
                grid: {
                    color: darkMode ? '#333' : '#e5e7eb',
                    drawTicks: false
                }
            },
            x: {
                ticks: {
                    color: darkMode ? '#b0b0b0' : '#718096',
                    font: { size: 14 }
                },
                grid: {
                    color: 'transparent'
                }
            }
        }
    };

    const genericChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: darkMode ? '#b0b0b0' : '#718096' } },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: false, ticks: { color: darkMode ? '#b0b0b0' : '#718096' } },
            x: { ticks: { color: darkMode ? '#b0b0b0' : '#718096' } },
        },
    };

    return (
        <div className={`dashboard-page ${darkMode ? 'dark' : ''}`}>
            <Navbar showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <div className="dashboard-container">
                {/* Health Metrics (Heart Rate, Steps, Calories) */}
                <div className="dashboard-grid">
                    <div className="health-metric card">
                        <div className="metric-header"><FaHeartbeat className="metric-icon" /><h3>Heart Rate</h3></div>
                        <div className="metric-content"><p className="metric-value">{dashboardData.heartRate} <span>bpm</span></p><div className={`metric-change ${dashboardData.heartRate > 75 ? 'negative' : 'positive'}`}>{dashboardData.heartRate > 75 ? <FiTrendingDown /> : <FiTrendingUp />}<span>{dashboardData.heartRate > 75 ? 'Above Avg' : 'Normal'}</span></div></div>
                    </div>
                    <div className="health-metric card">
                        <div className="metric-header"><GiFootsteps className="metric-icon" /><h3>Steps</h3></div>
                        <div className="metric-content"><p className="metric-value">{dashboardData.steps.toLocaleString()}</p><div className="metric-change positive"><FiTrendingUp /><span>Active Day</span></div></div>
                    </div>
                    <div className="health-metric card">
                        <div className="metric-header"><FaFire className="metric-icon" /><h3>Calories</h3></div>
                        <div className="metric-content"><p className="metric-value">{dashboardData.calories.toLocaleString()} <span>kcal</span></p><div className="metric-change positive"><FiTrendingUp /><span>On track</span></div></div>
                    </div>
                </div>

                {/* Workout Tracking and Heart Rate Graph */}
                <div className="dashboard-grid">
                    <div className="workout-tracking card">
                        <h2>Workout Tracking</h2>
                        <div className="workout-item"><div className="workout-icon-container"><FaWalking className="workout-icon" /></div><div className="workout-details"><p className="workout-type">Walking</p><p className="workout-stats">4.8 km • {Math.round(dashboardData.calories * 0.2)} kcal</p></div><span className="workout-distance">{dashboardData.steps.toLocaleString()} steps</span></div>
                        <div className="workout-item"><div className="workout-icon-container"><FaRunning className="workout-icon" /></div><div className="workout-details"><p className="workout-type">Running</p><p className="workout-stats">25 mins • 321 kcal</p></div><span className="workout-distance">3.2 km</span></div>
                        <div className="workout-item"><div className="workout-icon-container"><FaBiking className="workout-icon" /></div><div className="workout-details"><p className="workout-type">Cycling</p><p className="workout-stats">45 mins • 450 kcal</p></div><span className="workout-distance">12.5 km</span></div>
                    </div>
                    
                    {/* Premium Heart Rate Graph */}
                    <div className="heart-rate-graph card">
                        <h2>Heart Rate</h2>
                        <div className="heart-rate-stats">
                            <div className="heart-rate-value"><FaHeartbeat className="heart-icon" style={{color: '#ff4d4d'}} /><p>{dashboardData.heartRate} <span>BPM</span></p></div>
                            <div className="heart-rate-range"><p>Min: {Math.min(...dashboardData.heartRateData)}</p><p>Max: {Math.max(...dashboardData.heartRateData)}</p></div>
                        </div>
                        <div className="graph-container" style={{height: '200px'}}>
                            <Line data={heartRateChartData} options={heartRateChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Sleep Analysis and Nutrition Breakdown */}
                <div className="dashboard-grid">
                    <div className="sleep-analysis card">
                        <h2>Sleep Analysis</h2>
                        <p className="sleep-avg">{(dashboardData.sleepData.reduce((a, b) => a + parseFloat(b), 0) / 7).toFixed(1)}h avg</p>
                        <div className="graph-container" style={{ height: '200px' }}><Line data={sleepChartData} options={genericChartOptions} /></div>
                    </div>
                    <div className="nutrition-breakdown card">
                        <h2>Nutrition</h2>
                        <div className="nutrition-stats">
                            <div className="nutrition-item"><p>Calories</p><p>{dashboardData.calories} / {dashboardData.calorieGoal}</p><div className="progress-bar"><div className="progress" style={{ width: `${(dashboardData.calories / dashboardData.calorieGoal) * 100}%` }}></div></div></div>
                            <div className="nutrition-item"><p>Protein</p><p>{dashboardData.protein}g / {dashboardData.proteinGoal}g</p><div className="progress-bar"><div className="progress protein" style={{ width: `${(dashboardData.protein / dashboardData.proteinGoal) * 100}%` }}></div></div></div>
                            <div className="nutrition-item"><p>Carbs</p><p>{dashboardData.carbs}g / {dashboardData.carbsGoal}g</p><div className="progress-bar"><div className="progress carbs" style={{ width: `${(dashboardData.carbs / dashboardData.carbsGoal) * 100}%` }}></div></div></div>
                            <div className="nutrition-item"><p>Fat</p><p>{dashboardData.fat}g / {dashboardData.fatGoal}g</p><div className="progress-bar"><div className="progress fat" style={{ width: `${(dashboardData.fat / dashboardData.fatGoal) * 100}%` }}></div></div></div>
                        </div>
                        <div className="nutrition-pie">
                            <div className="pie-chart"><div className="pie-segment protein" style={{ '--value': dashboardData.nutritionPie.protein }}></div><div className="pie-segment carbs" style={{ '--value': dashboardData.nutritionPie.carbs }}></div><div className="pie-segment fat" style={{ '--value': dashboardData.nutritionPie.fat }}></div><div className="pie-center"><span>{dashboardData.nutritionPie.protein}%</span><span>Protein</span></div></div>
                            <div className="pie-legend"><div className="legend-item"><span className="legend-color protein"></span><span>Protein</span></div><div className="legend-item"><span className="legend-color carbs"></span><span>Carbs</span></div><div className="legend-item"><span className="legend-color fat"></span><span>Fat</span></div></div>
                        </div>
                    </div>
                </div>

                {/* Activity Progress with Tabs */}
                <div className="activity-progress card">
                    <div className="progress-header">
                        <h2>Activity Progress</h2>
                        <div className="tabs"><button className="tab active">Weekly</button><button className="tab">Monthly</button></div>
                    </div>
                    <div className="graph-container" style={{ height: '200px' }}><Bar data={activityChartData} options={genericChartOptions} /></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;