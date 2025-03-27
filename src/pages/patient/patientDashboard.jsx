import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../../styles/patientDashboardStyle.scss";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async (user) => {
      if (!user) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        setUserID(user.uid);

        if (userDocSnap.exists()) {
          setPatientInfo(userDocSnap.data());
        } else {
          setError("Patient data not found");
        }
      } catch (err) {
        setError("Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchPatientData(user);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleDiagnose = () => {
    navigate("/diagnose");
  };

  const handleChatbot = () => {
    navigate("/chatbot");
  };

  const handleCall = () => {
    navigate(`/videochat/${patientInfo.name.replace(/\s/g, "")}`);
  };

  return (
    <div className="dashboard-container">
      <h2>Patient Dashboard</h2>

      {loading ? (
        <p>Loading patient information...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> {patientInfo.name}</p>
            <p><strong>Age:</strong> {patientInfo.age}</p>
            <p><strong>Medical Conditions:</strong> {patientInfo.conditions || "None"}</p>
            <p><strong>Caretaker:</strong> {patientInfo.caretaker || "None"}</p>
          </div>
          <div className="dashboard-actions">
            <button onClick={handleDiagnose} className="primary-button">AI Diagnose</button>
            <button onClick={handleChatbot} className="secondary-button">Chatbot Assistant</button>
            <button onClick={handleCall} className="call-button">Call</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDashboard;
