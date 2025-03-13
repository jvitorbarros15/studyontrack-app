import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data in Firestore
            await setDoc(doc(db, "users", user.uid), { email });

            // Show success message
            setMessageType("success");
            setMessage("✅ Account Registered!");

            setTimeout(() => {
                setMessage("");
                navigate("/login");
            }, 2000);
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setMessageType("error");
                setMessage("⚠️ Your email is already registered. Try logging in!");
            } else {
                setMessageType("error");
                setMessage("⚠️ Registration failed. Please try again.");
            }

            setTimeout(() => setMessage(""), 3000); // Hide after 3 seconds
        }
    };

    return (
        <div className="register-container">
            {message && <div className={`popup-message ${messageType}`}>{message}</div>}
            
            <button className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft className="back-icon" /> Back
            </button>

            <div className="register-card">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="register-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="register-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
