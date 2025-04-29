import { useState } from "react";
import Header from "./Header";
import InputPanel from "./InputPanel";
import ChartPanel from "./ChartPanel";
import { ChartData } from "chart.js";

const MainLayout = () => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  return (
    <div className="main-layout">
      <Header />
      <div className="content-grid">
        <InputPanel setChartData={setChartData} />
        <ChartPanel chartData={chartData} />
      </div>
    </div>
  );
};

export default MainLayout;
