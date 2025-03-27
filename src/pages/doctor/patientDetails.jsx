import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import "../../styles/PatientDetails.scss";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientRef = doc(db, "users", patientId);
        const patientSnap = await getDoc(patientRef);
        const doctorRef = doc(db, "users", auth.currentUser.uid);
        const doctorSnap = await getDoc(doctorRef);

        if (patientSnap.exists()) {
          setPatient({ id: patientSnap.id, ...patientSnap.data() });
        }
        if (doctorSnap.exists()) {
          setDoctor({ id: doctorSnap.id, ...doctorSnap.data() });
        }

        const q = query(collection(db, "reports"), where("patientId", "==", patientId));
        const reportsSnap = await getDocs(q);
        const reportList = reportsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setReports(reportList);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [db, patientId]);

  const handleAddReport = async () => {
    if (!newReport.trim()) return;

    try {
      const reportRef = await addDoc(collection(db, "reports"), {
        patientId,
        reportText: newReport,
        createdAt: new Date(),
      });

      setReports([...reports, { id: reportRef.id, reportText: newReport, createdAt: new Date() }]);
      setNewReport("");
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  const handleStartVideoChat = () => {
    navigate(`/videochat/${doctor.name.replace(/\s/g, "")}`);
  };

  return (
    <div className="patient-details">
      {loading ? <p>Loading...</p> : (
        patient ? (
          <>
            <div className="patient-info">
              <h2>{patient.name}</h2>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Medical Conditions:</strong> {patient.medicalConditions || "None"}</p>
              <p><strong>Caretaker Name:</strong> {patient.caretakerName || "N/A"}</p>
              <button onClick={handleStartVideoChat} className="video-chat-btn">Start Video Chat</button>
            </div>

            <div className="patient-reports">
              <h3>Reports</h3>
              {reports.length > 0 ? (
                <ul>
                  {reports.map((report) => (
                    <li key={report.id}>
                    {report.reportText} -{" "}
                    {report.createdAt instanceof Date 
                      ? report.createdAt.toLocaleString() 
                      : new Date(report.createdAt.seconds * 1000).toLocaleString()}
                  </li>
                  ))}
                </ul>
              ) : <p>No reports found.</p>}

              <div className="add-report">
                <textarea 
                  value={newReport} 
                  onChange={(e) => setNewReport(e.target.value)} 
                  placeholder="Add a new report..."
                />
                <button onClick={handleAddReport}>Add Report</button>
              </div>
            </div>
          </>
        ) : <p>Patient not found.</p>
      )}
    </div>
  );
};

export default PatientDetails;