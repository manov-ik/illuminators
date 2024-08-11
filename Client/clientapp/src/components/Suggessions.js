import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Hero = () => {
  const [insights, setInsights] = useState("");
  const [error, setError] = useState(null);

  // Replace these values with actual values from your data
  const heartrate = 82; // Example heart rate value
  const spo2 = 95; // Example SpO2 value

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ heartrate, spo2 }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setInsights(data.insights);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchInsights();
  }, [heartrate, spo2]);

  return (
    <div className="wrapper min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex flex-col items-center h-full p-8">
        <div className="bg-gray-950 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-center text-4xl font-bold mb-6 text-red-500">Insights</h2>
          <div className="text-center mt-4">
            {error ? (
              <p className="text-red-500 text-lg">{error}</p>
            ) : (
              <p className="text-white text-2xl font-medium">{insights || "Fetching insights..."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
