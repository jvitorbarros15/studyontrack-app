import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase"; // Firestore import
import { doc, setDoc } from "firebase/firestore";
import "./AddCourse.css"; // New CSS for better styling

const AddCourse = ({ onAddCourse, userId, existingCourses }) => {
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseId.trim() || !courseName.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const courseExists = existingCourses.some(
      (course) => course.courseId === courseId && course.courseName === courseName
    );

    if (courseExists) {
      setError("You already added this course.");
      return;
    }

    try {
      const newCourse = {
        courseId,
        courseName,
        homeworkScores: [],
        examScores: [],
      };

      onAddCourse(newCourse);

      await setDoc(doc(db, "users", userId, "courses", courseId), newCourse);

      setCourseId("");
      setCourseName("");
      setError("");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding course:", error);
      setError("Failed to add course. Please try again.");
    }
  };

  return (
    <div className="add-course-wrapper">
      <div className="add-course-card">
        <h2>Add a New Course</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="add-course-btn">Add Course</button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
