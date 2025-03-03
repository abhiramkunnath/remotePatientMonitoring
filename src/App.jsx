import { Routes, Route } from "react-router-dom";
import "./styles/app.scss";
import Login from "./pages/login";
import Home from "./pages/Home";
import DoctorSignup from "./pages/doctor/doctorSignup";
import PatientSignup from "./pages/patient/patientSignup";
import PatientDashboard from "./pages/patient/patientDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register/doctor" element={<DoctorSignup/>} />
        <Route path="/register/patient" element={<PatientSignup/>} />
        <Route path="/patient-dashboard" element={<PatientDashboard/>} />
      </Routes>
    </>
  );
}

export default App;
