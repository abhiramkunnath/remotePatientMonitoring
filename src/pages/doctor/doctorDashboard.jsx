import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import "../../styles/DoctorDashboard.scss";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setDoctorId(user.uid);
          fetchPatients(user.uid);
        }
      });
    };

    const fetchPatients = async (doctorUid) => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "patient"), where("doctorId", "==", doctorUid));
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

  const handleAddPatient = async () => {
    if (!patientEmail) return;

    try {
      const q = query(collection(db, "users"), where("email", "==", patientEmail), where("role", "==", "patient"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Patient not found!");
        return;
      }

      const patientDoc = querySnapshot.docs[0];
      const patientRef = doc(db, "users", patientDoc.id);

      await updateDoc(patientRef, { doctorId });

      setPatients([...patients, { id: patientDoc.id, ...patientDoc.data(), doctorId }]);
      setShowModal(false);
      setPatientEmail("");
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Assigned Patients</h2>
      <button onClick={() => setShowModal(true)} className="add-patient-btn">Add Patient</button>

      {loading ? <p>Loading...</p> : (
        patients.length > 0 ? (
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
                <tr key={patient.id} onClick={() => navigate(`/patientDetails/${patient.id}`)}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.medicalConditions || "None"}</td>
                  <td>{patient.caretakerName || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No current patients.</p>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Patient</h3>
            <input 
              type="email" 
              placeholder="Enter patient email" 
              value={patientEmail} 
              onChange={(e) => setPatientEmail(e.target.value)} 
            />
            <button onClick={handleAddPatient}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
