import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Sleep from './pages/Sleep';
import Goals from './pages/Goals';
import Nutrition from './pages/Nutrition';
import Workout from './pages/Workout';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

function App() {
  // Initialize darkMode state from localStorage, default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Persist darkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to the root element (e.g., <body> or <html>)
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${darkMode ? 'dark' : ''}`}>
          <Routes>
            <Route
              path="/"
              element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/signin"
              element={<SignIn darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/signup"
              element={<SignUp darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/features"
              element={<Features darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sleep"
              element={
                <ProtectedRoute>
                  <Sleep darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <Nutrition darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/google/callback" element={<Dashboard darkMode={false} toggleDarkMode={() => {}} />} />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;