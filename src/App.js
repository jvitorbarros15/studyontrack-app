import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useParams } from "react-router-dom";
import Chart from "chart.js/auto";
import "./App.css";
import Login from "./Login";
import CourseDetail from "./CourseDetail"; // Import Course Details Page
import AddCourse from "./AddCourse"; // Import AddCourse component
import UpdateScores from "./UpdateScores"; // Import UpdateScores component

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

  const handleAddCourse = (newCourse) => {
      setGrades((prevGrades) => [...prevGrades, newCourse]);
  };

  const handleUpdateScores = (scores) => {
      scores.forEach(({ type, score }) => {
          // Assuming the type is in the format "Homework: CourseID" or "Exam: CourseID"
          const [scoreType, courseId] = type.split(':');
          const course = grades.find(c => c.courseId === courseId.trim());
          if (course) {
              if (scoreType.trim() === 'Homework') {
                  course.homeworkScores.push(score);
              } else if (scoreType.trim() === 'Exam') {
                  course.examScores.push(score);
              }
          }
      });
      setGrades([...grades]); // Update the state to trigger re-render
  };

  const handleRemoveCourse = (courseId) => {
      setGrades((prevGrades) => prevGrades.filter(course => course.courseId !== courseId));
  };

  return (
      <Router>
          <div className="App">
              {/* HEADER WITH LOGOUT BUTTON AND HOME BUTTON */}
              <header className="App-header">
                  <h1>Student Progress Tracker</h1>
                  <Link to="/dashboard" className="course-button" style={{ marginRight: '20px' }}>Home</Link>
                  {isLoggedIn && (
                      <>
                          <button className="logout-button" onClick={handleLogout}>
                              Logout
                          </button>
                          <Link to="/add-course" className="course-button" style={{ marginLeft: '20px' }}>
                              Add Course
                          </Link>
                      </>
                  )}
              </header>
              
              <Routes>
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="/dashboard" element={isLoggedIn ? <Dashboard grades={grades} /> : <Navigate to="/login" />} />
                  <Route path="/course/:courseId" element={isLoggedIn ? <CourseDetail courses={grades} onUpdateScores={handleUpdateScores} onRemoveCourse={handleRemoveCourse} /> : <Navigate to="/login" />} />
                  <Route path="/add-course" element={<AddCourse onAddCourse={handleAddCourse} />} />
                  <Route path="/update-scores" element={<UpdateScores onUpdateScores={handleUpdateScores} />} />
                  <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
