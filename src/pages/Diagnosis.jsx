import React, { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";
import {  
  collection, 
  addDoc
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/DiseaseDiagnosis.scss";

const groq = new Groq({
  apiKey: import.meta.env.VITE_REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function DiseaseDiagnosis() {
  const [symptoms, setSymptoms] = useState("");
  const [testResults, setTestResults] = useState("");
  const [diagnosisReport, setDiagnosisReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const diagnosisReportRef = useRef(null);

  const patientId = auth.currentUser.uid;

  useEffect(() => {
    // Scroll to diagnosis report when it's generated
    if (diagnosisReport && diagnosisReportRef.current) {
      diagnosisReportRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [diagnosisReport]);

  const handleAddReportToFirestore = async (reportContent) => {
    if (!patientId) {
      console.error("No patient ID provided");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        patientId,
        reportText: reportContent,
        reportType: "AI Diagnosis",
        createdAt: new Date(),
      });
      console.log("Report added to Firestore successfully");
    } catch (error) {
      console.error("Error adding report to Firestore:", error);
    }
  };

  const handleDiagnosis = async () => {
    // Prevent sending if symptoms are empty
    if (symptoms.trim() === "") {
      alert("Please enter your symptoms");
      return;
    }

    setIsLoading(true);
    setDiagnosisReport(null);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional medical AI assistant specializing in disease diagnosis. 
            Provide a comprehensive medical assessment based on the symptoms and optional test results.
            Your response should include:
            1. Possible diagnoses (up to 3)
            2. Confidence level for each diagnosis
            3. Recommended next steps
            4. Important notes for the patient
            
            Format your response in a clear, structured manner.
            Be thorough but avoid causing unnecessary alarm.
            Emphasize the importance of consulting a healthcare professional for definitive diagnosis.`
          },
          {
            role: "user",
            content: `Symptoms: ${symptoms}
            ${testResults ? `Test Results: ${testResults}` : 'No additional test results provided'}`
          }
        ],
        model: "llama3-8b-8192",
      });

      const responseContent = chatCompletion.choices[0]?.message?.content || 
        "Unable to generate a diagnosis report at this time.";

      setDiagnosisReport(responseContent);

      // Add report to Firestore
      if (patientId) {
        await handleAddReportToFirestore(responseContent);
      }
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      setDiagnosisReport("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="disease-diagnosis-container">
      <div className="app-name">
        <h1>AI Disease Diagnosis</h1>
      </div>

      <div className="diagnosis-input-container">
        <div className="input-section">
          <label htmlFor="symptoms">Describe Your Symptoms</label>
          <textarea
            id="symptoms"
            className="symptoms-input"
            placeholder="Enter your symptoms in detail (e.g., type of pain, duration, location)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        <div className="input-section">
          <label htmlFor="test-results">Test Results (Optional)</label>
          <textarea
            id="test-results"
            className="test-results-input"
            placeholder="Enter any relevant test results or medical history"
            value={testResults}
            onChange={(e) => setTestResults(e.target.value)}
          />
        </div>

        {patientId && (
          <div className="patient-note">
            <p>Diagnosis report will be added to patient's medical records</p>
          </div>
        )}

        <button 
          onClick={handleDiagnosis}
          disabled={isLoading || (patientId && !patientId.trim())}
        >
          {isLoading ? 'Generating Report...' : 'Get Diagnosis Report'}
        </button>
      </div>

      {diagnosisReport && (
        <div 
          ref={diagnosisReportRef}
          className="diagnosis-report"
        >
          <h2>Diagnosis Report</h2>
          <div className="report-content">
            {diagnosisReport.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div className="report-disclaimer">
            <strong>Disclaimer:</strong> This is an AI-generated preliminary assessment. 
            Always consult a healthcare professional for accurate diagnosis and treatment.
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseDiagnosis;