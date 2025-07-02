import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/navigation/Navbar1';
import '../styles/components/goals.css';
import { FiTarget, FiZap, FiClock, FiTrash2, FiEdit2, FiAward } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Goals = ({ darkMode, toggleDarkMode }) => {
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    unit: ''
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { user } = useContext(AuthContext);

  // Calculate total score
  const totalScore = goals.reduce((sum, goal) => sum + (goal.points || 0), 0);
  const completedGoals = goals.filter(goal => goal.type === 'completed').length;

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target || !newGoal.unit) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/goals',
        newGoal,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setGoals([...goals, response.data]);
      setNewGoal({ name: '', target: '', unit: '' });
      alert('Goal added successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      alert(error.response?.data?.message || 'Failed to add goal');
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to update goals');
        return;
      }

      // Validate the progress value
      const progress = Number(newProgress);
      if (isNaN(progress) || progress < 0) {
        alert('Please enter a valid progress value');
        return;
      }

      const goal = goals.find(g => g._id === id);
      if (!goal) {
        alert('Goal not found');
        return;
      }

      if (progress > goal.target) {
        alert(`Progress cannot exceed target value of ${goal.target}`);
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/goals/${id}`,
        { progress },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setGoals(goals.map(goal => goal._id === id ? response.data : goal));
        setEditingGoal(null);
        setEditValue('');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      alert(error.response?.data?.message || 'Failed to update goal');
      setEditingGoal(null);
      setEditValue('');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to delete goals');
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/goals/${id}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.message === 'Goal deleted successfully') {
        setGoals(goals.filter(goal => goal._id !== id));
        alert('Goal deleted successfully!');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please sign in again.');
      } else if (error.response?.status === 404) {
        alert('Goal not found. It may have been already deleted.');
      } else {
        alert(error.response?.data?.message || 'Failed to delete goal. Please try again.');
      }
    }
  };

  const displayedGoals = goals.filter((goal) => goal.type === activeTab);

  return (
    <div className={`goals-page ${darkMode ? 'dark' : ''}`}>
      <Navbar showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="goals-container">
        <div className="goals-header">
          <div className="goals-title-container">
            <h1 className="goals-title">Goals</h1>
            <p className="goals-subtitle">Set targets and track your progress</p>
          </div>
          <div className="goals-score-section">
            <div className="score-info">
              <h2 className="score-title">Goal Score</h2>
              <p className="score-subtitle">
                {completedGoals} {completedGoals === 1 ? 'goal' : 'goals'} done
              </p>
            </div>
            <div className="score-value">
              {totalScore}
              <span>pts</span>
            </div>
          </div>
        </div>

        <div className="goals-tabs">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Goals
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="goals-grid">
          {displayedGoals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <div className="goal-header">
                <FiTarget />
                <h3>{goal.name}</h3>
                <button 
                  className="delete-goal-btn"
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="goal-content">
                <p className="goal-progress">Progress</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  ></div>
                </div>
                <p className="goal-stats">
                  {goal.progress} / {goal.target} {goal.unit}
                </p>
                {goal.type === 'active' ? (
                  <p className="goal-remaining">{goal.remaining}% remaining</p>
                ) : (
                  <p className="goal-points">
                    Goal achieved! <span className="points">+{goal.points} points</span>
                  </p>
                )}
                {editingGoal === goal._id ? (
                  <div className="edit-progress-input">
                    <input
                      type="number"
                      min="0"
                      max={goal.target}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdateProgress(goal._id, editValue);
                        }
                      }}
                      onBlur={() => {
                        if (editValue) {
                          handleUpdateProgress(goal._id, editValue);
                        } else {
                          setEditingGoal(null);
                          setEditValue('');
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    className="edit-progress-btn"
                    onClick={() => {
                      setEditingGoal(goal._id);
                      setEditValue(goal.progress.toString());
                    }}
                  >
                    <FiEdit2 /> Edit Progress
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'active' && (
          <div className="add-goal-form">
            <h2>Add New Goal</h2>
            <form onSubmit={handleAddGoal} className="add-goal-form">
              <input
                type="text"
                placeholder="Goal Name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Target Value"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
              <input
                type="text"
                placeholder="Unit (e.g., kg, km, minutes)"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              />
              <button type="submit">Add Goal</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;