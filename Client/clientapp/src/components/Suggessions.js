import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Hero = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState("");
  const [error, setError] = useState(null);

  // Replace these values with actual values from your data
  const heartrate = 82; // Example heart rate value
  const spo2 = 95; // Example SpO2 value

  useEffect(() => {
    // Define the function to fetch insights
    const fetchInsights = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000//insights', {
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
    <div className='wrapper md:px-20 lg:px-40'>
      <Navbar />
      <h2 className="text-white text-center text-4xl">Insights</h2>
      <div className="insights-container text-center mt-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-white">{insights || "Fetching insights..."}</p>
        )}
      </div>
    </div>
  );
};

export default Hero;
