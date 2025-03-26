import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import "../../styles/DoctorDashboard.scss";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctor = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setDoctorId(user.uid);
          fetchPatients();
        }
      });
    };

    const fetchPatients = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "patient"));
        const querySnapshot = await getDocs(q);
        const patientList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [auth, db]);

  return (
    <div className="doctor-dashboard">
      <h2>Assigned Patients</h2>
      {loading ? <p>Loading...</p> : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Medical Conditions</th>
              <th>Caretaker Name</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.medicalConditions || "None"}</td>
                <td>{patient.caretakerName || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorDashboard;
