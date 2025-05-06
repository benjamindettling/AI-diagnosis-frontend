import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartDataset,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface ChartPanelProps {
  chartData: ChartData<"bar"> | null;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ chartData }) => {
  const [history, setHistory] = useState<DiagnosisResponse[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [mergedChart, setMergedChart] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    if (showHistory) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/storage`)
        .then((response) => {
          setHistory(response.data);
        })
        .catch((err) => console.error("Failed to load history", err));
    }
  }, [showHistory]);

  const handleHistorySelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/clear-history`);
      setHistory([]);
      setSelectedIndices([]);
      setMergedChart(null);
      console.log("History cleared");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const mergeSelectedHistories = () => {
    const selectedHistories = selectedIndices
      .map((i) => history[i])
      .filter(Boolean);
    if (selectedHistories.length === 0) return;

    const diagnosisSet = new Set(
      selectedHistories.flatMap((entry) => entry.diagnoses.map((d) => d.name))
    );

    const labels = Array.from(diagnosisSet);

    const datasets = selectedHistories.map(
      (entry, idx): ChartDataset<"bar"> => {
        const probabilities = labels.map(
          (label) =>
            entry.diagnoses.find((d) => d.name === label)?.probability || 0
        );

        const colors = [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(100, 255, 132, 0.6)",
        ];

        const bg = colors[idx % colors.length];
        const border = bg.replace("0.6", "1");

        return {
          label: `${entry.symptom} (Age: ${entry.age}, Gender: ${entry.gender}, Ethnicity: ${entry.Ethnicity})`,
          data: probabilities,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
        };
      }
    );

    setMergedChart({
      labels,
      datasets,
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🆕 make chart flexible inside panel
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#2b384d", // Darker color for readability
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "Possible Diagnoses and Their Probabilities",
        color: "#2b384d",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#2b384d" },
        grid: { color: "rgba(43, 56, 77, 0.1)" },
      },
      y: {
        ticks: { color: "#2b384d" },
        grid: { color: "rgba(43, 56, 77, 0.1)" },
      },
    },
  };

  return (
    <div className="chart-panel">
      <h2>
        Prediction Monitor <i className="fa-solid fa-chart-column"></i>
      </h2>

      <div style={{ width: "100%", height: "400px" }}>
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
      <button
        className="cta-btn cta-btn--hero"
        onClick={() => setShowHistory(!showHistory)}
        style={{ marginTop: "20px" }}
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <>
          <h3>History</h3>
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
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIndices.includes(index)}
                      onChange={() => handleHistorySelect(index)}
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

          <div className="history-action-buttons">
            <button
              className="cta-btn cta-btn--hero"
              onClick={mergeSelectedHistories}
            >
              Compare
            </button>
            <button
              className="cta-btn cta-btn--hero"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          </div>
        </>
      )}

      {mergedChart && (
        <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
          <h3 style={{ color: "#2b384d", textAlign: "center" }}>
            Merged Result
          </h3>
          <Bar data={mergedChart} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ChartPanel;
