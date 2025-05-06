import React, { useState } from "react";
import DDL from "../DDL";
import axios from "axios";
import { ChartData } from "chart.js";

interface InputPanelProps {
  setChartData: (data: ChartData<"bar">) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ setChartData }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [ethnicity, setEthnicity] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSymptomSelection = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setErrorMessage("Please enter a symptom.");
      return;
    }

    try {
      const response = await axios.post(
        "https://ai-diagnosis-backend-0ams.onrender.com/diagnose",
        {
          symptom: selectedSymptoms.join(", "),
          age,
          gender,
          Ethnicity: ethnicity,
        }
      );

      const { diagnoses } = response.data;
      const labels = diagnoses.map((d: any) => d.name);
      const probabilities = diagnoses.map((d: any) => d.probability);

      setChartData({
        labels,
        datasets: [
          {
            label: "Diagnosis Probabilities",
            data: probabilities,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data from the server.");
    }
  };

  return (
    <div className="input-panel">
      <h2 className="input-panel__heading">Select Your Symptoms</h2>

      {/* Symptom Search */}
      <DDL
        selectedSymptoms={selectedSymptoms}
        onSymptomSelect={handleSymptomSelection}
      />

      {/* NEW: Selected Symptoms Display */}
      {selectedSymptoms.length > 0 && (
        <div className="selected-symptoms">
          {selectedSymptoms.map((symptom) => (
            <div className="symptom-chip" key={symptom}>
              {symptom}
              <span
                className="remove-chip"
                onClick={() => handleSymptomSelection(symptom)}
              >
                ✖
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Age / Gender / Ethnicity Inputs */}
      <div className="input-fields">
        <label htmlFor="age-slider">Age: {age}</label>
        <input
          id="age-slider"
          type="range"
          min={0}
          max={120}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <label>Ethnicity:</label>
        <input
          className="input"
          type="text"
          placeholder="Enter Ethnicity"
          value={ethnicity}
          onChange={(e) => setEthnicity(e.target.value)}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
      )}

      {/* Submit Button */}
      <div style={{ marginTop: "1rem" }}>
        <button className="cta-btn cta-btn--hero" onClick={handleSubmit}>
          Get Diagnosis
        </button>
      </div>
    </div>
  );
};
// <button className="cta-btn cta-btn--resume" onClick={handleShowHistory}>Show History</button>
// <button className="cta-btn cta-btn--resume" onClick={handleClearHistory}>Clear History</button>

export default InputPanel;
