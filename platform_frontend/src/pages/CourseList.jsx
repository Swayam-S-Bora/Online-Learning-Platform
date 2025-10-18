import React, { useEffect, useState } from 'react';
import axios from '../api/axios';  // Your custom axios with interceptor

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses');
        setCourses(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error loading courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  
  return (
    <div style={{ maxWidth: 600, margin: '1rem auto', fontFamily: 'Arial' }}>
      <h2>Course List</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {courses.length === 0 ? (
          <li>No courses found</li>
        ) : (
          courses.map((course) => (
            <li key={course._id}>
              <strong>{course.title}</strong>
              <p>{course.description}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CourseList;