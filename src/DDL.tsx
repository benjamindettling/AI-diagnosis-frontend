import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Simulated list of symptoms
const defaultsymptomsList = [
  "Itching",
  "Skin Rash",
  "Nodal Skin Eruptions",
  "Continuous Sneezing",
  "Shivering",
  "Chills",
  "Joint Pain",
  "Stomach Pain",
  "Acidity",
  "Ulcers on Tongue",
  "Muscle Wasting",
  "Vomiting",
  "Burning Micturition",
  "Fatigue",
  "Weight Gain",
  "Anxiety",
  "Cold Hands and Feet",
  "Mood Swings",
  "Weight Loss",
  "Restlessness",
  "Lethargy",
  "Patches in Throat",
  "Irregular Sugar Level",
  "Cough",
  "High Fever",
  "Sunken Eyes",
  "Breathlessness",
  "Sweating",
  "Dehydration",
  "Indigestion",
  "Headache",
  "Yellowish Skin",
  "Dark Urine",
  "Nausea",
  "Loss of Appetite",
  "Pain Behind the Eyes",
  "Back Pain",
  "Constipation",
  "Abdominal Pain",
  "Diarrhoea",
  "Mild Fever",
  "Yellow Urine",
  "Yellowing of Eyes",
  "Acute Liver Failure",
  "Fluid Overload",
  "Swelling of Stomach",
  "Swelled Lymph Nodes",
  "Malaise",
  "Blurred and Distorted Vision",
  "Phlegm",
  "Throat Irritation",
  "Redness of Eyes",
  "Sinus Pressure",
  "Runny Nose",
  "Congestion",
  "Chest Pain",
  "Weakness in Limbs",
  "Fast Heart Rate",
  "Pain During Bowel Movements",
  "Pain in Anal Region",
  "Bloody Stool",
  "Irritation in Anus",
  "Neck Pain",
  "Dizziness",
  "Cramps",
  "Bruising",
  "Obesity",
  "Swollen Legs",
  "Swollen Blood Vessels",
  "Puffy Face and Eyes",
  "Enlarged Thyroid",
  "Brittle Nails",
  "Swollen Extremities",
  "Excessive Hunger",
  "Extra-Marital Contacts",
  "Drying and Tingling Lips",
  "Slurred Speech",
  "Knee Pain",
  "Hip Joint Pain",
  "Muscle Weakness",
  "Stiff Neck",
  "Swelling Joints",
  "Movement Stiffness",
  "Spinning Movements",
  "Loss of Balance",
  "Unsteadiness",
  "Weakness of One Body Side",
  "Loss of Smell",
  "Bladder Discomfort",
  "Foul Smell of Urine",
  "Continuous Feel of Urine",
  "Passage of Gases",
  "Internal Itching",
  "Toxic Look (Typhos)",
  "Depression",
  "Irritability",
  "Muscle Pain",
  "Altered Sensorium",
  "Red Spots Over Body",
  "Belly Pain",
  "Abnormal Menstruation",
  "Dischromic Patches",
  "Watering From Eyes",
  "Increased Appetite",
  "Polyuria",
  "Family History",
  "Mucoid Sputum",
  "Rusty Sputum",
  "Lack of Concentration",
  "Visual Disturbances",
  "Receiving Blood Transfusion",
  "Receiving Unsterile Injections",
  "Coma",
  "Stomach Bleeding",
  "Distention of Abdomen",
  "History of Alcohol Consumption",
  "Blood in Sputum",
  "Prominent Veins on Calf",
  "Palpitations",
  "Painful Walking",
  "Pus-Filled Pimples",
  "Blackheads",
  "Scarring",
  "Skin Peeling",
  "Silver-Like Dusting",
  "Small Dents in Nails",
  "Inflammatory Nails",
  "Blister",
  "Red Sore Around Nose",
  "Yellow Crust Ooze",
  "Hypothermia",
];

// Fetch symptoms dynamically from the backend
// const fetchSymptoms = async (searchTerm: string): Promise<string[]> => {
//   try {
//     const response = await axios.get("http://localhost:3001/query", {
//       params: { query: searchTerm },
//     });
//     return response.data.symptoms || [];
//   } catch (error) {
//     console.error("Failed to fetch symptoms:", error);
//     return [];
//   }
// };

interface DDLProps {
  selectedSymptoms: string[];
  onSymptomSelect: (symptom: string) => void;
}

const DDL: React.FC<DDLProps> = ({ selectedSymptoms, onSymptomSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState(false); // State for toggling list visibility
  const [symptomsList, setSymptomsList] = useState<string[]>([
    ...defaultsymptomsList,
  ]);

  const fetchSymptomsFromGPT = async (input: string) => {
    try {
      const response = await axios.post("http://localhost:3001/query", {
        query: input,
      });
      const newSymptoms: string[] = response.data.symptoms || [];

      setSymptomsList((prev) => Array.from(new Set([...newSymptoms, ...prev])));
    } catch (error) {
      console.error("Failed to fetch symptoms from GPT:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSymptomsFromGPT(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="symptom-search-block">
      <div className="symptom-input-wrapper">
        <input
          className="symptom-search-input"
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsListVisible(true);
          }}
        />

        <button
          type="button"
          className={`dropdown-toggle-button ${isListVisible ? "rotated" : ""}`}
          onClick={() => setIsListVisible((prev) => !prev)}
        >
          <i className="fa-solid fa-caret-down"></i>
        </button>
      </div>

      {isListVisible && symptomsList.length > 0 && (
        <ul className="symptom-list">
          {symptomsList.map((symptom: string) => (
            <li
              key={symptom}
              className={`symptom-item ${
                selectedSymptoms.includes(symptom) ? "selected" : ""
              }`}
              onClick={() => onSymptomSelect(symptom)}
            >
              {symptom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DDL;
