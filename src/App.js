import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useParams } from "react-router-dom";
import Chart from "chart.js/auto";
import "./App.css";
import Login from "./Login";
import CourseDetail from "./CourseDetail"; // Import Course Details Page

const sampleCourses = [
    { 
        courseId: "CS101", 
        courseName: "Intro to Programming", 
        homeworkScores: [70, 80, 85, 90], 
        examScores: [60, 75, 78, 82] 
    },
    { 
        courseId: "CS102", 
        courseName: "Data Structures", 
        homeworkScores: [88, 92, 95, 97], 
        examScores: [80, 85, 88, 90] 
    },
    { 
        courseId: "CS103", 
        courseName: "Algorithms", 
        homeworkScores: [70, 74, 79, 83], 
        examScores: [65, 69, 75, 81] 
    },
];

function Dashboard({ grades }) {
  return (
      <div className="course-list">
          <h2>Courses</h2>
          <ul>
              {grades.map((course) => (
                  <li key={course.courseId}>
                      <Link to={`/course/${course.courseId}`} className="course-button">
                          {course.courseName}
                      </Link>
                  </li>
              ))}
          </ul>
      </div>
  );
}

function App() {
  const [grades, setGrades] = useState(sampleCourses);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username) => {
      console.log(`User logged in: ${username}`);
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      console.log("User logged out");
  };

  return (
      <Router>
          <div className="App">
              {/* HEADER WITH LOGOUT BUTTON */}
              <header className="App-header">
                  <h1>Student Progress Tracker</h1>
                  {isLoggedIn && (
                      <button className="logout-button" onClick={handleLogout}>
                          Logout
                      </button>
                  )}
              </header>
              
              <Routes>
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="/dashboard" element={isLoggedIn ? <Dashboard grades={grades} /> : <Navigate to="/login" />} />
                  <Route path="/course/:courseId" element={isLoggedIn ? <CourseDetail courses={grades} /> : <Navigate to="/login" />} />
                  <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
