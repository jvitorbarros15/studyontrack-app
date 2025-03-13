import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import CourseDetail from "./CourseDetail"; 
import AddCourse from "./AddCourse"; 
import UpdateScores from "./UpdateScores"; 
import Register from "./Register";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

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
  const [user, setUser] = useState(null);
  const [grades, setGrades] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingCourses, setExistingCourses] = useState([]); 

  useEffect(() => {
    const checkOnlineStatus = () => {
      if (!navigator.onLine) {
        console.warn("⚠️ The client is offline. Firestore operations may fail.");
      } else {
        console.log("✅ Connected to the internet.");
      }
    };
  
    // Run the online status check on mount
    checkOnlineStatus();
  
    // Listen for online/offline events
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        
        try {
          console.log("Fetching user data for:", user.uid);
          await fetchUserData(user.uid);
          await fetchExistingCourses(user.uid);
        } catch (error) {
          console.error("⚠️ Error fetching user data:", error);
          
          // Retry if the error is due to network issues
          if (error.message.includes("client is offline")) {
            console.warn("Retrying in 5 seconds...");
            setTimeout(() => {
              fetchUserData(user.uid);
              fetchExistingCourses(user.uid);
            }, 5000);
          }
        }
      } else {
        console.warn("🔴 User logged out or not authenticated.");
        setUser(null);
        setIsLoggedIn(false);
        setGrades([]);
        setExistingCourses([]);
      }
    });
  
    return () => {
      unsubscribe();
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, []);
  

  // Fetch user data
  const fetchUserData = async (userId) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setGrades(userSnap.data().grades || []);
      } else {
        console.log("No user document found!");
      }

      // Fetch courses
      fetchExistingCourses(userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user courses
  const fetchExistingCourses = async (userId) => {
    if (!userId) return;

    try {
        console.log("Fetching courses for user:", userId);

        const coursesRef = collection(db, "users", userId, "courses");
        const coursesSnap = await getDocs(coursesRef);
        const coursesList = coursesSnap.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data()
        }));

        console.log("Fetched courses from Firestore:", coursesList);

        setExistingCourses(coursesList);
        setGrades(coursesList); // Ensure courses are displayed
    } catch (error) {
        console.error("Error fetching existing courses:", error);
    }
};


  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Handle registration
  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { grades: [] });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  // Handle adding a course
  const handleAddCourse = async (newCourse) => {
    if (!user) {
        console.error("User not logged in");
        return;
    }

    try {
        console.log("Saving course to Firestore:", newCourse);

        await setDoc(doc(db, "users", user.uid, "courses", newCourse.courseId), newCourse);

        console.log("Course successfully saved in Firestore!");

        setGrades((prevGrades) => [...prevGrades, newCourse]);
        setExistingCourses((prevCourses) => [...prevCourses, newCourse]);

    } catch (error) {
        console.error("Error saving course:", error);
    }
};

  // Handle score updates
  const handleUpdateScores = (scores) => {
    scores.forEach(({ type, score }) => {
      const [scoreType, courseId] = type.split(":");
      const course = grades.find((c) => c.courseId === courseId.trim());

      if (course) {
        if (scoreType.trim() === "Homework") {
          course.homeworkScores.push(score);
        } else if (scoreType.trim() === "Exam") {
          course.examScores.push(score);
        }
      }
    });

    setGrades([...grades]);
  };

  // Handle course removal
  const handleRemoveCourse = (courseId) => {
    setGrades((prevGrades) => prevGrades.filter((course) => course.courseId !== courseId));
  };

  return (
      <Router>
          <div className="App">
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
                  <Route path="/register" element={<Register onRegister={handleRegister} />} />
                  <Route path="/dashboard" element={isLoggedIn ? <Dashboard grades={grades} /> : <Navigate to="/login" />} />
                  <Route path="/course/:courseId" element={isLoggedIn ? <CourseDetail courses={grades} onUpdateScores={handleUpdateScores} onRemoveCourse={handleRemoveCourse} /> : <Navigate to="/login" />} />
                  <Route path="/add-course" element={isLoggedIn ? <AddCourse onAddCourse={handleAddCourse} userId={user?.uid} existingCourses={existingCourses} /> : <Navigate to="/login" />} />
                  <Route path="/update-scores" element={<UpdateScores onUpdateScores={handleUpdateScores} />} />
                  <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
