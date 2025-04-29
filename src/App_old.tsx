import React, { useState, useEffect } from "react";
import "./App.css";
import DDL from "./DDL";
import Footer from "./Footer";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartDataset } from "chart.js";
import axios from "axios";


// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Diagnosis = {
  name: string;
  probability: number;
};

type DiagnosisResponse = {
  symptom: string;
  diagnoses: Diagnosis[];
  age: string;
  gender: string; 
  Ethnicity: string;
};


const App: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const [gender, setGender] = useState<string>(""); // New state for gender
  const [Ethnicity, setEthnicity] = useState<string>(""); // New state for Ethnicity
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [responseData, setResponseData] = useState("");
  const [history, setHistory] = useState<DiagnosisResponse[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [comparisonCharts, setComparisonCharts] = useState<ChartData<"bar">[] | null>(null);
  const [mergedChart, setMergedChart] = useState<ChartData<'bar'> | null>(null);

  const minAge = 0; // Minimum age
  const maxAge = 120; // Maximum age
  const [age, setAge] = useState<string>(String(minAge)); // Initialize age with minAge as a string




  useEffect(() => {
    console.log("ChartData updated:", chartData);
  }, [chartData]);

  useEffect(() => {
    if (showHistory) {
      const loadHistory = async () => {
        try {
          const response = await axios.get("http://localhost:3001/storage");
          setHistory(response.data);
        } catch (error) {
          console.error("Error loading history:", error);
          setErrorMessage("Failed to load history.");
        }
      };
      loadHistory();
    }
  }, [showHistory]);

  const toggleShowHistory = () => {
    setShowHistory((prev) => {
      if (prev) {
        setComparisonCharts([]);
        setMergedChart(null);
      }
      return !prev;
    });
  };

  const highlightLabelDifferences = (
    first: DiagnosisResponse,
    current: DiagnosisResponse
  ): string => {
    const compare = (key: keyof DiagnosisResponse): string => {
      //const firstValue = first[key] || "N/A";
      const currentValue = current[key] || "N/A";
  
      // if (firstValue === "N/A" && currentValue !== "N/A") {
      //   return `${currentValue}`; // 
      // }
      // if (firstValue !== "N/A" && currentValue === "N/A") {
      //   return `-${firstValue}`; // 
      // }
      // if (firstValue !== currentValue) {
      //   return `+${currentValue} / -${firstValue}`; // 
      // }
      return `${currentValue}`; // 
    };
    return `Probability in ${
      compare("symptom")
    } (Age: ${compare("age")}, Gender: ${compare("gender")}, Ethnicity: ${compare("Ethnicity")})`;
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setErrorMessage("Please enter a symptom.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3001/diagnose", {
        symptom: selectedSymptoms.join(", "),
        age,
        gender,
        Ethnicity,
      });

      const { symptom, diagnoses} = response.data;
      if (diagnoses.length === 0) {
        setErrorMessage("No data returned from the server.");
        return;
      }

      const labels = diagnoses.map((item: Diagnosis) => item.name);
      const probabilities = diagnoses.map((item: Diagnosis) => item.probability);

      const newColor = `hsl(${Math.random() * 360}, 55%, 60%)`;
      
      const currentEntry: DiagnosisResponse = {
        symptom,
        diagnoses,
        age: age !== undefined && age !== null ? age : "N/A",
        gender: gender || "N/A",
        Ethnicity: Ethnicity || "N/A",
      };
      const baselineEntry = history.length > 0 ? history[0] : null;
      const updatedDatasets = (chartData?.datasets || []).map((dataset, index) => {
        // Extract the current dataset entry's label information
        const match = dataset.label?.match(
          /Probability in (.*?) \(Age: (.*?), Gender: (.*?), Ethnicity: (.*?)\)/
        );
  
        const existingEntry: DiagnosisResponse = {
          symptom: match?.[1] || "N/A",
          age: match?.[2] || "N/A",
          gender: match?.[3] || "N/A",
          Ethnicity: match?.[4] || "N/A",
          diagnoses: [], // Diagnoses are not stored in the label, so they remain empty here
        };
  
        // Highlight differences compared to the baseline
        const updatedLabel = baselineEntry
          ? highlightLabelDifferences(baselineEntry, existingEntry)
          : dataset.label;
  
        return {
          ...dataset,
          label: updatedLabel,
        };
      });

      const currentLabel = baselineEntry
      ? highlightLabelDifferences(baselineEntry, currentEntry)
      : `Probability in ${symptom} (Age: ${
          age !== undefined && age !== null ? age : "N/A"
        }, Gender: ${gender || "N/A"}, Ethnicity: ${Ethnicity || "N/A"})`;

      const currentDataset = {
        label: currentLabel,
        data: probabilities,
        backgroundColor: newColor, // Single color for all bars in this submission
        borderColor: newColor.replace(/60%/, "40%"), // Slightly darker border
        borderWidth: 1,
      };

      setChartData({
        labels,
        datasets: [...updatedDatasets, currentDataset],
      });

      setHistory((prevHistory) => [...prevHistory, { symptom, diagnoses, age: age !== undefined && age !== null ? age : "N/A",
        gender: gender || "N/A",
        Ethnicity: Ethnicity || "N/A", }]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data from the server.");
    }
  };

  const handleHistorySelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index] 
    );
  };

  const compareSelectedHistories = () => {
    if (selectedIndices.length !== 2) {
      alert("Please select exactly two items from history to compare.");
      return;
    }
  
    const [firstIndex, secondIndex] = selectedIndices;
  
    if (firstIndex === undefined || secondIndex === undefined) {
      alert("Please select exactly two valid items from history.");
      return;
    }
  
    const first = history[firstIndex];
    const second = history[secondIndex];
  
    if (!first || !second) {
      alert("Selected history items are invalid.");
      return;
    }
  
    const createChartData = (response: DiagnosisResponse, backgroundColor: string, borderColor: string): ChartData<'bar'> => {
      const labels = response.diagnoses.map((item) => item.name);
      const probabilities = response.diagnoses.map((item) => item.probability);
  
      return {
        labels,
        datasets: [
          {
            label: `Probability (%) for ${response.symptom} (Age: ${response.age || "N/A"}, Gender: ${response.gender || "N/A"}, Ethnicity: ${response.Ethnicity || "N/A"})`,
            data: probabilities,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      };
    };

    const firstChartData = createChartData(
        first,
        "#7557a9",
        "#7557a9",
    );
    const secondChartData = createChartData(
        second,
        "#f57c00",
        "#f57c00"
    );
  
    setComparisonCharts([firstChartData, secondChartData]); 
  };

  const clearHistory = async () => {
    try {
    await axios.delete("http://localhost:3001/clear-history");
    setHistory([]); 
    setErrorMessage("");
    } catch (error) {
    console.error("Error clearing history:", error);
    setErrorMessage("Failed to clear history.");
    }
};

  

  // Handle adding/removing symptoms from the selection
  const handleSymptomSelection = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };


  //ChartJS.register(customLegendPlugin);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white', 
        },
      },
      title: {
        display: true,
        text: 'Possible Diagnoses and Their Probabilities',
        color: 'white', 
      },
      //customLegendPlugin,
    },
    scales: {
      x: {
        ticks: {
          color: 'white', 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', 
        },
      },
      y: {
        ticks: {
          color: 'white', 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', 
        },
      },
    },
  };

  
  const mergeSelectedHistories = () => {
    if (selectedIndices.length === 0) {
      alert("Please select at least one item from history to view.");
      return;
    }
  
    const selectedHistories = selectedIndices.map((index) => history[index]);
  
    if (selectedHistories.some((entry) => !entry)) {
      alert("Some selected history items are invalid.");
      return;
    }
  
    if (selectedHistories.length === 1) {
      const [entry] = selectedHistories;
      if (!entry) {
        alert("Selected history item is invalid.");
        return;
      }
      const labels = entry.diagnoses.map((d) => d.name);
      const data = entry.diagnoses.map((d) => d.probability);
  
      const singleChartData: ChartData<"bar"> = {
        labels,
        datasets: [
          {
            label: `Probability in ${entry.symptom} (Age: ${entry.age || "N/A"}, Gender: ${entry.gender || "N/A"}, Ethnicity: ${entry.Ethnicity || "N/A"})`,
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Default color for single history
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
  
      setMergedChart(singleChartData);
      return;
    }

    const firstHistory = selectedHistories[0]; // Reference history to compare with others

    if (!firstHistory) {
      alert("First selected history item is invalid.");
      return;
    }
  
    const diagnosisSet = new Set(
      selectedHistories
        .filter((entry): entry is DiagnosisResponse => !!entry) 
        .flatMap((entry) => entry.diagnoses.map((d) => d.name))
    );
  
    const labels = Array.from(diagnosisSet);
  
    const datasets = selectedHistories
      .filter((entry): entry is DiagnosisResponse => !!entry) 
      .map((entry, idx): ChartDataset<"bar"> => {
        const probabilities = labels.map(
          (label) => entry.diagnoses.find((d) => d.name === label)?.probability || 0
        );
  
        const colors = [
          "rgba(75, 192, 192, 0.6)", // Blue
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(54, 162, 235, 0.6)", // Light Blue
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(100, 255, 132, 0.6)", // Green
        ];
  
        const backgroundColor = colors[idx % colors.length] || "rgba(75, 192, 192, 0.6)";
        const borderColor = backgroundColor.replace("0.6", "1");
  
        return {
          label: highlightLabelDifferences(firstHistory, entry),
          data: probabilities,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        };
      });
  
    const mergedChartData: ChartData<"bar"> = {
      labels,
      datasets,
    };
  
    setMergedChart(mergedChartData);
  };

  
  

  return (
    <div className="app-container">
      <div className="ddl">
        {/*<h1 className="chat-text">Search and Select Symptoms</h1>*/}

        <DDL selectedSymptoms={selectedSymptoms} onSymptomSelect={(symptom) => {
          setSelectedSymptoms((prev) =>
            prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
          );
        }} />
        <div className="input-fields">
          <div className="year-slider-container">
            <label htmlFor="year-slider"> Age: {age}</label>
            <input
                id="year-slider"
                type="range"
                min={minAge}
                max={maxAge}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="year-slider"
            />
            
          </div>
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="" disabled>Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Ethnicity:
            <input
                type="text"
                value={Ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                placeholder="Enter Ethnicity"
                required
            />
          </label>
        </div>
      </div>


      <div className="chat-interface">
        <h2 className="chat-text">Prediction Monitor <i className="fa-solid fa-chart-column"></i></h2>

        <div className="selected-symptoms">
          {selectedSymptoms.map((symptom) => (
              <div className="symptom-chip" key={symptom}>
                {symptom} <span className="remove-chip" onClick={() => handleSymptomSelection(symptom)}>✖</span>
              </div>
          ))}
        </div>

        <br/>

        <button onClick={handleSubmit} style={{marginRight: '10px'}}>Get Diagnosis</button>
        <button onClick={toggleShowHistory}>{showHistory ? "Hide History" : "Show History"}</button>
        <button onClick={clearHistory} style={{ marginLeft: "10px" }}>
             Clear History
            </button>

            {chartData && (
              <div>
                <Bar data={chartData} options={chartOptions}/>
                
              </div>
            )}

        {showHistory && (
          <div className="history-container">
            <h3 className="chat-text" style={{color:"#2b384d"}}>History</h3>
            {/* Quick Stats/Overview */}
              <div className="history-summary">
                <p style={{marginBottom: "0rem"}}><strong>Number of Submissions:</strong> {history.length}</p>
                {/* Maximal Probability and Disease */}
                <p>
                <strong>Disease with Maximum Probability: </strong>
                {history.length > 0 ? (
                (() => {
                  let maxProbability = 0;
                  let maxDisease = '';
                  const diseaseSet = new Set<string>(); // Set to track unique diseases

                  // Loop through all entries and diagnoses to calculate values
                  history.forEach((entry) => {
                    entry.diagnoses.forEach((diagnosis) => {
                    diseaseSet.add(diagnosis.name); // Add the disease to the Set
                    if (diagnosis.probability > maxProbability) {
                      maxProbability = diagnosis.probability;
                      maxDisease = diagnosis.name;
                    }
                    });
                  });

                return (
          <>
            <span>{maxDisease} ({maxProbability.toFixed(2)}%)</span>
            <p><strong> Different Diseases: </strong> {diseaseSet.size} </p>  
          </>
                );
              })()
            ) : (
            "N/A"
            )}
              </p>

            </div>
              {/* History Table*/}
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Symptoms</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Ethnicity</th>
                  </tr>
                </thead>
              <tbody>
                  {history.map((entry, index) => (
                  <tr key={index} className={selectedIndices.includes(index) ? "selected-entry" : ""}>
               <td>
                <input
                    type="checkbox"
                    checked={selectedIndices.includes(index)}
                    onChange={() => handleHistorySelect(index)}
                    title="Select this entry for comparison"
                  />
                </td>
                <td>{entry.symptom}</td>
                <td>{entry.age}</td>
                <td>{entry.gender}</td>
                <td>{entry.Ethnicity}</td>
                </tr>
        ))}
              </tbody>
             </table>

             {selectedIndices.length > 0 && (
    <div className="selected-history-details">
      <h4>Selected Entries' Details:</h4>
      
      <p className="differing-inputs-notice">
      <strong>Note:</strong> Highlighted fields indicate differences between the selected entries.
      </p>

      {selectedIndices.map((index) => {
        const entry = history[index];

        if (!entry) return null;

        // Extract the values for symptom, age, gender, and Ethnicity from all selected entries
        const selectedSymptoms = selectedIndices.map((i) => history[i]?.symptom);
        const selectedAges = selectedIndices.map((i) => history[i]?.age);
        const selectedGenders = selectedIndices.map((i) => history[i]?.gender);
        const selectedEthnicitys = selectedIndices.map((i) => history[i]?.Ethnicity);

        // Check for differences in each category
        const symptomIsSame = selectedSymptoms.every((s) => s === selectedSymptoms[0]);
        const ageIsSame = selectedAges.every((a) => a === selectedAges[0]);
        const genderIsSame = selectedGenders.every((g) => g === selectedGenders[0]);
        const EthnicityIsSame = selectedEthnicitys.every((r) => r === selectedEthnicitys[0]);

        return (
          <div className="history-card" key={index}>
            <h5> <span style={{
                backgroundColor: symptomIsSame ? "transparent" : "rgba(255,242,0,0.8)",
                color: symptomIsSame ? "#000000" : "#000000" // Highlight if different
              }}>{entry?.symptom}</span>
              </h5>
            
            {/* Highlight Age if it differs */}
            <p>
              <span
              style={{
                backgroundColor: ageIsSame ? "transparent" : "rgba(255,242,0,0.8)", // Highlight if different
                color: ageIsSame ? "#000000" : "#000000"
              }}
            >
              <strong>Age:</strong> {entry?.age}
              </span>
            </p>

            {/* Highlight Gender if it differs */}
            <p>
              <span
              style={{
                backgroundColor: genderIsSame ? "transparent" : "rgba(255,242,0,0.8)", //Highlight if different
                color: genderIsSame ? "#000000" : "#000000"
              }}
            >
              <strong>Gender:</strong> {entry?.gender}
              </span>
            </p>

            {/* Highlight Ethnicity if it differs */}
            <p>
              <span
              style={{
                backgroundColor: EthnicityIsSame ? "transparent" : "rgba(255,242,0,0.8)", // Highlight if different.
                color: EthnicityIsSame ? "#000000" : "#000000"
              }}
            >
              <strong>Ethnicity:</strong> {entry?.Ethnicity}
              </span>
            </p>

            <p><strong>Diagnoses:</strong></p>
            <ul>
              {entry?.diagnoses?.map((diagnosis, i) => (
                <li key={i}>
                  {diagnosis.name}: {diagnosis.probability}%
                </li>
              ))}
            </ul>
          </div>
        );

      })}
    </div>
  )}

            
            <button
            onClick={mergeSelectedHistories}
            style={{
              marginLeft: "10px",
            }}
          >
            Show
          </button>
          </div>
        )}

        {comparisonCharts && comparisonCharts.map((chart, index) => (
          <div key={index} style={{ marginTop: "20px" }}>
            <h3 className="chat-text">Comparison Chart {index + 1}</h3>
            <Bar data={chart} options={chartOptions} />
          </div>
        ))}
        {mergedChart && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "white" }}>Result</h3>
          <Bar data={mergedChart} options={chartOptions} />
          
        </div>
      )}
      </div>
      </div>


  );
};

export default App;