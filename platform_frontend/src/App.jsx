import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Header from './components/Header';
import CourseList from './pages/CourseList';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isAuthenticated = !!token;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = (tokenValue) => {
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
  };

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={() => window.location.href = '/login'}
        onProfile={handleLogout}
      />
      <Routes>
        <Route
          path="/"
          element={
            <CourseList courses={courses} onLogout={handleLogout} />
          }
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;