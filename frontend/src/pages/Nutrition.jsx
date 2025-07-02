import React, { useState } from 'react';
import Navbar from '../components/navigation/Navbar1'; // Reusing the same Navbar
import '../styles/components/nutrition.css';
import { FiSearch, FiPlus, FiCalendar, FiX } from 'react-icons/fi'; // Icons for actions
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// Sample data for the Nutrition page
const initialNutrientDetails = {
  macros: [
    { name: 'Carbohydrates', subItems: [
      { name: 'Sugar', current: 45, target: 50, unit: 'g' },
      { name: 'Fiber', current: 22, target: 30, unit: 'g' },
      { name: 'Starch', current: 120, target: 150, unit: 'g' },
    ]},
    { name: 'Proteins', subItems: [
      { name: 'Essential Amino Acids', current: 35, target: 40, unit: 'g' },
      { name: 'Non-essential Amino Acids', current: 40, target: 45, unit: 'g' },
    ]},
    { name: 'Fats', subItems: [
      { name: 'Saturated', current: 15, target: 20, unit: 'g' },
      { name: 'Unsaturated', current: 38, target: 50, unit: 'g' },
      { name: 'Trans', current: 1, target: 2, unit: 'g' },
    ]},
   
    { name: 'Hydration', subItems: [
      { name: 'Water', current: 1, target: 2, unit: 'L' },
    ]},
]
};

const initialDailySummary = {
  calories: { current: 1850, target: 2500 },
  protein: { current: 95, target: 100 },
  carbs: { current: 220, target: 275 },
  fat: { current: 65, target: 85 },
  pieChart: { protein: 7900, carbs: 7600, fat: 7000 }, // Percentages for the pie chart
};

const initialNutritionTrends = [
  { day: 'Mon', calories: 2100 },
  { day: 'Tue', calories: 2300 },
  { day: 'Wed', calories: 2000 },
  { day: 'Thu', calories: 2400 },
  { day: 'Fri', calories: 2200 },
  { day: 'Sat', calories: 2300 },
  { day: 'Sun', calories: 1900 },
];

const initialTodaysMeals = [
  {
    id: 1,
    time: '7:30 AM',
    name: 'Breakfast',
    calories: 550,
    items: [
      { name: 'Oatmeal with berries', protein: 12, carbs: 58, fat: 6, calories: 320 },
      { name: 'Greek yogurt', protein: 15, carbs: 8, fat: 5, calories: 150 },
      { name: 'Coffee with milk', protein: 4, carbs: 6, fat: 4, calories: 80 },
    ],
  },
  {
    id: 2,
    time: '12:15 PM',
    name: 'Lunch',
    calories: 680,
    items: [
      { name: 'Grilled chicken salad', protein: 35, carbs: 25, fat: 22, calories: 450 },
      { name: 'Whole grain bread', protein: 5, carbs: 22, fat: 2, calories: 120 },
      { name: 'Apple', protein: 0, carbs: 30, fat: 0, calories: 110 },
    ],
  },
  {
    id: 3,
    time: '7:00 PM',
    name: 'Dinner',
    calories: 620,
    items: [
      { name: 'Salmon', protein: 40, carbs: 0, fat: 20, calories: 350 },
      { name: 'Quinoa', protein: 6, carbs: 32, fat: 2, calories: 170 },
      { name: 'Steamed vegetables', protein: 4, carbs: 20, fat: 1, calories: 100 },
    ],
  },
];

const Nutrition = ({ darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('macros');
  const [nutrientDetails] = useState(initialNutrientDetails);
  const [dailySummary, setDailySummary] = useState(initialDailySummary);
  const [nutritionTrends] = useState(initialNutritionTrends);
  const [todaysMeals, setTodaysMeals] = useState(initialTodaysMeals);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [showAddFoodForm, setShowAddFoodForm] = useState(null); // Stores the meal ID for adding food
  const [newMeal, setNewMeal] = useState({ name: '', time: '' });
  const [newFood, setNewFood] = useState({ name: '', protein: '', carbs: '', fat: '', calories: '' });
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMealForFood, setSelectedMealForFood] = useState('');

  // Sample food database
  const foodDatabase = [
    { name: 'Chicken Breast', protein: 31, carbs: 0, fat: 3.6, calories: 165 },
    { name: 'Brown Rice', protein: 2.6, carbs: 23, fat: 0.9, calories: 112 },
    { name: 'Salmon', protein: 22, carbs: 0, fat: 13, calories: 208 },
    { name: 'Sweet Potato', protein: 1.6, carbs: 20, fat: 0.1, calories: 86 },
    { name: 'Greek Yogurt', protein: 17, carbs: 9, fat: 0.7, calories: 130 },
    { name: 'Quinoa', protein: 4.4, carbs: 21, fat: 1.9, calories: 120 },
    { name: 'Avocado', protein: 2, carbs: 9, fat: 15, calories: 160 },
    { name: 'Eggs', protein: 13, carbs: 1.1, fat: 11, calories: 155 },
    { name: 'Almonds', protein: 6, carbs: 6, fat: 14, calories: 164 },
    { name: 'Spinach', protein: 2.9, carbs: 3.6, fat: 0.4, calories: 23 }
  ];

  // Handle adding a new meal
  const handleAddMeal = () => {
    if (newMeal.name && newMeal.time) {
      const newId = todaysMeals.length + 1;
      setTodaysMeals([
        ...todaysMeals,
        {
          id: newId,
          name: newMeal.name,
          time: newMeal.time,
          calories: 0,
          items: [],
        },
      ]);
      setNewMeal({ name: '', time: '' });
      setShowAddMealForm(false);
    }
  };

  // Handle adding food to a meal
  const handleAddFood = (mealId) => {
    if (newFood.name && newFood.protein && newFood.carbs && newFood.fat && newFood.calories) {
      const updatedMeals = todaysMeals.map((meal) => {
        if (meal.id === mealId) {
          const updatedItems = [
            ...meal.items,
            {
              name: newFood.name,
              protein: parseFloat(newFood.protein),
              carbs: parseFloat(newFood.carbs),
              fat: parseFloat(newFood.fat),
              calories: parseFloat(newFood.calories),
            },
          ];
          const newCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0);
          return { ...meal, items: updatedItems, calories: newCalories };
        }
        return meal;
      });

      // Update daily summary based on new food
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.protein, 0), 0);
      const totalCarbs = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.carbs, 0), 0);
      const totalFat = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.fat, 0), 0);

      setDailySummary({
        ...dailySummary,
        calories: { ...dailySummary.calories, current: totalCalories },
        protein: { ...dailySummary.protein, current: totalProtein },
        carbs: { ...dailySummary.carbs, current: totalCarbs },
        fat: { ...dailySummary.fat, current: totalFat },
        pieChart: {
          protein: totalProtein * 100,
          carbs: totalCarbs * 100,
          fat: totalFat * 100,
        },
      });

      setTodaysMeals(updatedMeals);
      setNewFood({ name: '', protein: '', carbs: '', fat: '', calories: '' });
      setShowAddFoodForm(null);
    }
  };

  // Placeholder for history button
  const handleViewHistory = () => {
    alert('View meal history (to be implemented)');
  };

  const handleFoodSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = foodDatabase.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddSearchedFood = (food) => {
    if (!selectedMealForFood) {
      alert('Please select a meal first');
      return;
    }

    const mealToUpdate = todaysMeals.find(meal => meal.name === selectedMealForFood);
    if (mealToUpdate) {
      const updatedMeals = todaysMeals.map(meal => {
        if (meal.id === mealToUpdate.id) {
          const updatedItems = [
            ...meal.items,
            {
              name: food.name,
              protein: food.protein,
              carbs: food.carbs,
              fat: food.fat,
              calories: food.calories
            }
          ];
          const newCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0);
          return { ...meal, items: updatedItems, calories: newCalories };
        }
        return meal;
      });

      // Update daily summary
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.protein, 0), 0);
      const totalCarbs = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.carbs, 0), 0);
      const totalFat = updatedMeals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + item.fat, 0), 0);

      setDailySummary({
        ...dailySummary,
        calories: { ...dailySummary.calories, current: totalCalories },
        protein: { ...dailySummary.protein, current: totalProtein },
        carbs: { ...dailySummary.carbs, current: totalCarbs },
        fat: { ...dailySummary.fat, current: totalFat },
        pieChart: {
          protein: totalProtein * 100,
          carbs: totalCarbs * 100,
          fat: totalFat * 100,
        },
      });

      setTodaysMeals(updatedMeals);
      setShowSearchModal(false);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMealForFood('');
    }
  };

  // Sample graph and pie chart data
  const nutritionTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: [1800, 2000, 2200, 2100, 1900, 2300, 2000],
        borderColor: '#4f8cff',
        backgroundColor: 'rgba(79,140,255,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4f8cff',
      },
    ],
  };

  const nutritionTrendsOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#718096' },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { color: '#718096' },
        grid: { color: 'transparent' },
      },
    },
  };

  const macroPieData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#4f8cff', '#fbbf24', '#f87171'],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      },
    ],
  };

  const macroPieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#222',
          font: { size: 14, weight: 'bold' },
          boxWidth: 18,
          padding: 18,
        },
      },
    },
  };

  return (
    <div className={`nutrition-page ${darkMode ? 'dark' : ''}`}>
      <Navbar showLinks={true} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="nutrition-container">


      <div className="todays-meals nutrition-card">
          <div className="meals-header">
            <h2>Today's Meals</h2>
            <div className="meals-actions">
              <button className="action-btn" onClick={() => setShowSearchModal(true)}>
                <FiSearch /> Find Food
              </button>
              <button className="action-btn primary" onClick={() => setShowAddMealForm(true)}>
                <FiPlus /> Add Meal
              </button>
            </div>
          </div>
          <div className="meals-grid">
            {todaysMeals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <h3>{meal.name}</h3>
                  <p>{meal.time}</p>
                  <p className="meal-calories">{meal.calories} calories</p>
                </div>
                <div className="meal-items">
                  {meal.items.map((item) => (
                    <div key={item.name} className="meal-item">
                      <p>{item.name}</p>
                      <p className="meal-item-stats">
                        P: {item.protein}g C: {item.carbs}g F: {item.fat}g
                      </p>
                      <p className="meal-item-calories">{item.calories} cal</p>
                    </div>
                  ))}
                  <button
                    className="add-food-btn"
                    onClick={() => setShowAddFoodForm(meal.id)}
                  >
                    <FiPlus /> Add Food
                  </button>
                  {showAddFoodForm === meal.id && (
                    <div className="add-food-form">
                      <input
                        type="text"
                        placeholder="Food Name"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Protein (g)"
                        value={newFood.protein}
                        onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Carbs (g)"
                        value={newFood.carbs}
                        onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Fat (g)"
                        value={newFood.fat}
                        onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Calories"
                        value={newFood.calories}
                        onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                      />
                      <button onClick={() => handleAddFood(meal.id)}>Add</button>
                      <button onClick={() => setShowAddFoodForm(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="meal-card snack">
              <h3>Add a snack</h3>
            </div>
          </div>
        </div>
        {/* Nutrient Details Section */}
        <div className="nutrient-details nutrition-card">
          <h2>Nutrient Details</h2>
          <div className="nutrient-tabs">
            {nutrientDetails.macros.map((category) => (
              <button
                key={category.name.toLowerCase()}
                className={`tab ${activeTab === category.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveTab(category.name.toLowerCase())}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="nutrient-content">
            {nutrientDetails.macros
              .filter((category) => category.name.toLowerCase() === activeTab)
              .map((category) => (
                <div key={category.name}>
                  {category.subItems.length > 0 ? (
                    category.subItems.map((item) => (
                      <div key={item.name} className="nutrient-item">
                        <p>{item.name}</p>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${(item.current / item.target) * 100}%` }}
                          ></div>
                        </div>
                        <p className="nutrient-stats">
                          {item.current} / {item.target} {item.unit}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No data available for this category.</p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Daily Summary and Nutrition Trends Section */}
        <div className="nutrition-header">
          <h1 className="nutrition-title">Nutrition</h1>
          <p className="nutrition-subtitle">Track your meals and nutritional intake</p>
          <div className="nutrition-actions">
            <button className="action-btn" onClick={handleViewHistory}>
              <FiCalendar /> History
            </button>
            <button className="action-btn primary" onClick={() => setShowAddMealForm(true)}>
              <FiPlus /> Log Meal
            </button>
          </div>
        </div>

        <div className="nutrition-grid">
          <div className="daily-summary nutrition-card">
            <h2>Daily Summary</h2>
            <p>Today's nutrition breakdown</p>
            <div className="summary-item">
              <p>Calories</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(dailySummary.calories.current / dailySummary.calories.target) * 100}%` }}
                ></div>
              </div>
              <p className="summary-stats">
                {dailySummary.calories.current} / {dailySummary.calories.target}{' '}
                <span>{dailySummary.calories.target - dailySummary.calories.current} calories remaining</span>
              </p>
            </div>
            <div className="summary-item">
              <p>Protein</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(dailySummary.protein.current / dailySummary.protein.target) * 100}%` }}
                ></div>
              </div>
              <p className="summary-stats">
                {dailySummary.protein.current}g / {dailySummary.protein.target}g
              </p>
            </div>
            <div className="summary-item">
              <p>Carbs</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(dailySummary.carbs.current / dailySummary.carbs.target) * 100}%` }}
                ></div>
              </div>
              <p className="summary-stats">
                {dailySummary.carbs.current}g / {dailySummary.carbs.target}g
              </p>
            </div>
            <div className="summary-item">
              <p>Fat</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(dailySummary.fat.current / dailySummary.fat.target) * 100}%` }}
                ></div>
              </div>
              <p className="summary-stats">
                {dailySummary.fat.current}g / {dailySummary.fat.target}g
              </p>
            </div>
          </div>

          <div className="nutrition-graphs">
            <div className="nutrition-trends-card card">
              <h2>Weekly Calorie Intake</h2>
              <div style={{ height: 220 }}>
                <Line data={nutritionTrendsData} options={nutritionTrendsOptions} />
              </div>
            </div>
            <div className="nutrition-pie-card card">
              <h2>Macros Breakdown</h2>
              <div style={{ maxWidth: 320, margin: '0 auto' }}>
                <Pie data={macroPieData} options={macroPieOptions} />
              </div>
            </div>
          </div>
        </div>

       
        {/* Add Meal Form */}
        {showAddMealForm && (
          <div className="add-meal-form">
            <h2>Add New Meal</h2>
            <input
              type="text"
              placeholder="Meal Name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Time (e.g., 7:30 AM)"
              value={newMeal.time}
              onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
            />
            <button onClick={handleAddMeal}>Add Meal</button>
            <button onClick={() => setShowAddMealForm(false)}>Cancel</button>
          </div>
        )}

        {/* Food Search Modal */}
        {showSearchModal && (
          <div className="search-modal">
            <div className="search-modal-content">
              <div className="search-modal-header">
                <h2>Find Food</h2>
                <button className="close-btn" onClick={() => setShowSearchModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => handleFoodSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="meal-selector">
                <label>Add to meal:</label>
                <select
                  value={selectedMealForFood}
                  onChange={(e) => setSelectedMealForFood(e.target.value)}
                >
                  <option value="">Select a meal</option>
                  {todaysMeals.map((meal) => (
                    <option key={meal.id} value={meal.name}>
                      {meal.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((food, index) => (
                    <div key={index} className="search-result-item">
                      <div className="food-info">
                        <h3>{food.name}</h3>
                        <p>
                          P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g | {food.calories} cal
                        </p>
                      </div>
                      <button
                        className="add-food-btn"
                        onClick={() => handleAddSearchedFood(food)}
                        disabled={!selectedMealForFood}
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-results">
                    {searchQuery ? 'No results found' : 'Start typing to search...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;