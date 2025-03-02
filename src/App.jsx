import { Routes, Route } from "react-router-dom";
import "./styles/app.scss";
import Login from "./pages/login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
