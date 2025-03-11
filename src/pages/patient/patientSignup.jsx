import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../styles/formStyle.scss";

import patientSignupImage from "../../assets/login-image.jpg";

const PatientSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState("");
  const [caretaker, setCaretaker] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role: "patient",
        name,
        age,
        conditions,
        caretaker,
      });
      alert("Patient registered successfully!");
      navigate("/patient-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={patientSignupImage} alt="Patient Signup" />
      </div>
      <div className="auth-form">
        <h2>Patient Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="password">password</label>
          <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label htmlFor="age">Age</label>
          <input type="number" id="age" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
          <label htmlFor="medcondition">Medical Conditions (if any)</label>
          <input type="text" id="medcondition" placeholder="Medical Conditions (if any)" value={conditions} onChange={(e) => setConditions(e.target.value)} />
          <label htmlFor="cname">Caretaker Name (Optional)</label>
          <input type="text" id="cname" placeholder="Caretaker Name (Optional)" value={caretaker} onChange={(e) => setCaretaker(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default PatientSignup;
