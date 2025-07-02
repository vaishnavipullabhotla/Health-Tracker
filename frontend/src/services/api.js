import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Nutrition API calls
export const nutritionApi = {
  getToday: () => api.get('/nutrition/today'),
  addMeal: (mealData) => api.post('/nutrition/meals', mealData),
  updateSummary: (summaryData) => api.put('/nutrition/summary', summaryData),
  getHistory: (startDate, endDate) => 
    api.get(`/nutrition/history?startDate=${startDate}&endDate=${endDate}`)
};

// Workout API calls
export const workoutApi = {
  getToday: () => api.get('/workouts/today'),
  addWorkout: (workoutData) => api.post('/workouts', workoutData),
  updateWorkout: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getHistory: (startDate, endDate) => 
    api.get(`/workouts/history?startDate=${startDate}&endDate=${endDate}`)
};

// Sleep API calls
export const sleepApi = {
  getToday: () => api.get('/sleep/today'),
  addSleep: (sleepData) => api.post('/sleep', sleepData),
  updateSleep: (id, sleepData) => api.put(`/sleep/${id}`, sleepData),
  deleteSleep: (id) => api.delete(`/sleep/${id}`),
  getHistory: (startDate, endDate) => 
    api.get(`/sleep/history?startDate=${startDate}&endDate=${endDate}`)
};

// Dashboard API calls
export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getTrends: () => api.get('/dashboard/trends')
};

// Auth API calls
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth')
};

// Goals API calls
export const goalsApi = {
  getGoals: () => api.get('/goals'),
  addGoal: (goalData) => api.post('/goals', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}`)
};

export default api; 