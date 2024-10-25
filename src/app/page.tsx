"use client";
import { useState, useEffect } from "react";
// import Image from "next/image";
import { Line, Bar } from "react-chartjs-2";
import { io } from "socket.io-client";
import moment from "moment-timezone";
import timezones from "./utils/timeZone";
import { generateMockData, TemperatureData } from "./utils/mockData";

export default function Home() {
  const [initial, setInitial] = useState<TemperatureData[]>(
    generateMockData(12)
  );
  const [timeZone, setTimeZone] = useState<string>("Asia/Jakarta");

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("temperatureUpdate", (newData: TemperatureData) => {
      setInitial((prevData) => [...prevData.slice(1), newData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = {
    labels: initial.map((point) =>
      moment(point.timestamp).tz(timezones[timeZone]).format("HH:mm:ss")
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: initial.map((point) => point.temperature),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Temperature Dashboard</h1>
      <select
        onChange={(data) => {
          setTimeZone(data.target.value);
        }}
        value={timeZone}
      >
        {Object.keys(timezones).map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: { title: { display: true, text: "Time (5-second intervals)" } },
            y: { title: { display: true, text: "Temperature (°C)" } },
          },
        }}
      />
      <Line
        data={chartData}
        options={{
          scales: {
            x: { title: { display: true, text: "Time (5-second intervals)" } },
            y: { title: { display: true, text: "Temperature (°C)" } },
          },
        }}
      />
    </div>
  );
}
