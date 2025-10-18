import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import CourseList from './pages/CourseList';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Maintain token state (persist with localStorage)
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Handle logout and keep state in sync
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CourseList onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<Login onLogin={setToken} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;