import React from "react";

function DiseaseRiskAssessment() {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#4caf50", padding: "20px", height: "100vh" }}>
            <div
                style={{
                    textAlign: "center",
                    backgroundColor: "#ff77a9",
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold",
                }}
            >
                MULTIPLE DISEASE RISK ASSESSMENT SYSTEM
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* Diseases Column */}
                <div style={{ backgroundColor: "#2196f3", padding: "20px", borderRadius: "10px", color: "white" }}>
                    <h3>Diseases that will be predicted:</h3>
                    <ul style={{ listStyleType: "none", padding: "0" }}>
                        <li>CARDIOVASCULAR</li>
                        <li>DIABETES</li>
                        <li>JAUNDICE</li>
                        <li>HEPATITIS</li>
                        <li>THYROID</li>
                        <li>ALLERGY</li>
                        <li>COMMON COLD</li>
                    </ul>
                </div>

                {/* Input Form */}
                <div style={{ backgroundColor: "#e3f2fd", padding: "20px", borderRadius: "10px", width: "40%" }}>
                    <h3>Enter your Personal Data:</h3>
                    <form>
                        <label>
                            Name:
                            <input type="text" placeholder="Enter your name" style={{ marginLeft: "10px", padding: "5px" }} />
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Age:
                            <input type="number" placeholder="Enter your age" style={{ marginLeft: "10px", padding: "5px" }} />
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Sex:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="male">MALE</option>
                                <option value="female">FEMALE</option>
                            </select>
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Weight:
                            <input type="number" placeholder="Enter your weight" style={{ marginLeft: "10px", padding: "5px" }} />
                        </label>
                        <br />
                        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "5px" }}>
                            Submit
                        </button>
                    </form>
                </div>

                {/* Symptoms Section */}
                <div style={{ backgroundColor: "#e3f2fd", padding: "20px", borderRadius: "10px", width: "40%" }}>
                    <h3>Enter the Symptoms:</h3>
                    <form>
                        <label>
                            Symptom1:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="chest_pain">chest_pain</option>
                                <option value="fever">fever</option>
                            </select>
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Symptom2:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="obesity">obesity</option>
                                <option value="fatigue">fatigue</option>
                            </select>
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Symptom3:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="vomiting">vomiting</option>
                                <option value="nausea">nausea</option>
                            </select>
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Symptom4:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="breathlessness">breathlessness</option>
                                <option value="headache">headache</option>
                            </select>
                        </label>
                        <br />
                        <label style={{ marginTop: "10px", display: "block" }}>
                            Symptom5:
                            <select style={{ marginLeft: "10px", padding: "5px" }}>
                                <option value="sweating">sweating</option>
                                <option value="dizziness">dizziness</option>
                            </select>
                        </label>
                        <br />
                        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "5px" }}>
                            Predict Disease
                        </button>
                        <p style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}>
                            Disease Predicted: <span style={{ color: "black" }}>Heart attack</span>
                        </p>
                        <button style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "5px" }}>
                            Calculate Severity
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DiseaseRiskAssessment;
