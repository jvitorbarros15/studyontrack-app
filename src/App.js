import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
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

function AppWrapper() {
    const location = useLocation(); // ✅ Use inside Router
    const [user, setUser] = useState(null);
    const [grades, setGrades] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [existingCourses, setExistingCourses] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setIsLoggedIn(true);
                await fetchUserData(user.uid);
            } else {
                setUser(null);
                setIsLoggedIn(false);
                setGrades([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        if (!userId) return;
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setGrades(userSnap.data().grades || []);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleAddCourse = async (newCourse) => {
      if (!user) {
          console.error("User not logged in");
          return;
      }
  
      try {
          console.log("Saving course to Firestore:", newCourse);
  
          await setDoc(doc(db, "users", user.uid, "courses", newCourse.courseId), newCourse);
  
          console.log("Course successfully saved in Firestore!");
  
          // Update state with the new course
          setGrades((prevGrades) => [...prevGrades, newCourse]);
          setExistingCourses((prevCourses) => [...prevCourses, newCourse]);
  
      } catch (error) {
          console.error("Error saving course:", error);
      }
  };
  

    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoggedIn(true);
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), { grades: [] });
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Error registering:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Student Progress Tracker</h1>

                {/* ✅ Button Container */}
                {isLoggedIn && (
                    <div className="header-buttons">
                        {location.pathname !== "/login" && location.pathname !== "/register" && (
                            <Link to="/dashboard" className="course-button">Home</Link>
                        )}
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                        <Link to="/add-course" className="course-button">Add Course</Link>
                    </div>
                )}
          </header>



            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onRegister={handleRegister} />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard grades={grades} /> : <Navigate to="/login" />} />
                <Route path="/course/:courseId" element={isLoggedIn ? <CourseDetail courses={grades} /> : <Navigate to="/login" />} />
                <Route path="/add-course" element={<AddCourse onAddCourse={handleAddCourse} userId={user?.uid} existingCourses={existingCourses} />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

// ✅ Wrap `AppWrapper` inside `<Router>`
function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
