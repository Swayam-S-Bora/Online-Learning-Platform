import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/courses')
      .then(res => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          setError('Failed to load courses');
        }
      })
      .catch(() => setError('Error fetching courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id || course.id}>
            <h3>{course.name}</h3>
            <p><b>Instructor:</b> {course.instructor}</p>
            <p>{course.description}</p>
            <p><b>Price:</b> ${course.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;