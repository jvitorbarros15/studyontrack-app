import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const AddCourse = ({ onAddCourse }) => {
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (courseId && courseName) {
            onAddCourse({ courseId, courseName, homeworkScores: [], examScores: [] });
            navigate('/dashboard'); // Redirect to dashboard after adding
        }
    };

    return (
        <div className="login-container">
            <h1>Add Course</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course ID"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />
                <button type="submit">Add Course</button>
            </form>
            <Link to="/dashboard" className="home-button" style={{ marginTop: '20px' }}>Home</Link>
        </div>
    );
};

export default AddCourse; 