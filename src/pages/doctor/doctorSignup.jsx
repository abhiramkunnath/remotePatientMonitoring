import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../styles/formStyle.scss";

import doctorSignupImage from "../../assets/login-image.jpg";

const DoctorSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [medicalId, setMedicalId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "doctor",
        name,
        specialization,
        hospital,
        medicalId,
      });
      alert("Doctor registered successfully!");
      navigate("/doctor-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={doctorSignupImage} alt="Doctor Signup" />
      </div>
      <div className="auth-form">
        <h2>Doctor Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
          <input type="text" placeholder="Hospital Name" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
          <input type="text" placeholder="Medical ID Number" value={medicalId} onChange={(e) => setMedicalId(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;
