import { Routes, Route } from "react-router-dom";

import "./styles/app.scss";
import Login from "./pages/login";
import Home from "./pages/Home";
import DoctorSignup from "./pages/doctor/doctorSignup";
import PatientSignup from "./pages/patient/patientSignup";
import PatientDashboard from "./pages/patient/patientDashboard";
import Chatbot from "./pages/chatbot";
import DoctorDashboard from "./pages/doctor/doctorDashboard";
import PatientDetails from "./pages/doctor/patientDetails";

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/doctor" element={<DoctorSignup />} />
          <Route path="/register/patient" element={<PatientSignup />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patientDetails/:patientId" element={<PatientDetails />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
    </>
  );
}

export default App;
