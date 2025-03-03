import React from "react";
import "../styles/Home.scss";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">
          R<sup>+</sup> RemoteDx
        </div>
        <nav className="navbar">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main className="homepage-content">
        <div className="homepage-content-left">
          <h1>
            Your Health, <span>Simplified.</span>
          </h1>
          <div className="buttons">
            <Link className="reactlink" to="/login">
              <button className="learn-more">Log In</button>
            </Link>
            <button className="view-team">View Team</button>
          </div>
          <div className="patient-options">
            <Link className="reactlink" to="/register/patient">
              <div className="option patientOp">
                <div className="option-left">
                  <h2>Register as Patient</h2>
                  <p>Get AI diagnosis, assistance and much more</p>
                  <div className="arrow-button">→</div>
                </div>
              </div>
            </Link>
            <Link className="reactlink" to="/register/doctor">
              <div className="option doctorOp">
                <div className="option-left">
                  <h2>Register as Doctor</h2>
                  <p>Manage patients and create reports</p>
                  <div className="arrow-button">→</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="homepage-content-right">
          <div className="video-section">
            <img
              src="https://sph.umich.edu/frontlines/posts/2023/images/sashatretyakovablog3.png"
              alt="Telehealth consultation"
              className="video-img"
            />
            <button className="watch-button">Watch</button>
          </div>
          <p className="description">
            RemoteDx is an AI-powered remote patient monitoring and diagnostic
            assistant that helps users track their health. Designed for both
            patients and healthcare providers, RemoteDx enables proactive
            healthcare management, reducing hospital visits while ensuring
            timely medical intervention.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
