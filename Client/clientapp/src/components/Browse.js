import React, { useEffect, useState, useRef } from 'react';
import Navbar from "./Navbar";
import 'react-circular-progressbar/dist/styles.css';
import OxygenLevelGraph from './Oxygengraph';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase'; 
import { ref, onValue, query, limitToLast } from "firebase/database"; 

const Browse = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpo2] = useState(null);
  
  // Refs for the ECG animation
  const ecgRef = useRef(null);

  const navigate = useNavigate();

  // Threshold values
  const heartRateThreshold = 60;
  const spo2Threshold = 90;

  useEffect(() => {
    const healthDataRef = query(ref(db, 'HealthData'), limitToLast(1)); // Get the most recent entry

    // Fetch the data when it changes
    onValue(healthDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestEntry = Object.values(data)[0]; // Get the most recent data entry
        const newHeartRate = latestEntry.HeartRate || 0;
        const newSpo2 = latestEntry.SpO2 || 0;

        setHeartRate(newHeartRate);
        setSpo2(newSpo2);

        // Check if the values are below the threshold and trigger an alert
        if (newHeartRate < heartRateThreshold) {
          alert(`Warning: Heart Rate is below ${heartRateThreshold} bpm!`);
        }
        if (newSpo2 < spo2Threshold) {
          alert(`Warning: SpO2 level is below ${spo2Threshold}%!`);
        }
      }
    });

    // ECG Animation Logic
    const canvas = ecgRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#222'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00FF00"; // Bright green color for ECG line
    ctx.lineWidth = 2;

    let x = 0;
    let points = [];
    const speed = 2;

    function generateAmplitude(x) {
      if (x % 100 < 10) {
        return 20 + Math.random() * 20; // Sharp spike up
      } else if (x % 100 > 90) {
        return 50 + Math.random() * 10; // Rounded peak
      } else {
        return 50 + Math.sin(x / 10) * 5 + Math.random() * 3; // Baseline with slight variations
      }
    }

    function drawECG() {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      const amplitude = generateAmplitude(x);
      points.push({ x, y: amplitude });

      x += speed;

      if (points.length > canvas.width / speed) {
        points.shift();
      }

      if (points.length > 1) {
        ctx.moveTo(points[0].x, points[0].y); 
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        if (points.length > 2) {
          ctx.quadraticCurveTo(
            points[points.length - 2].x,
            points[points.length - 2].y,
            points[points.length - 1].x,
            points[points.length - 1].y
          );
        }
        ctx.stroke();
      }

      if (x > canvas.width) {
        x = 0;
      }

      requestAnimationFrame(drawECG);
    }

    drawECG();
  }, []);

  return (
    <div className='wrapper md:px-20 lg:px-40'>
      <Navbar />
     
      <div className="w-80 mx-auto Pulse p-4 rounded-xl text-white shadow-lg">
        <div className="pb-2">
          <h2 className="text-lg">Pulse Rate</h2>
          <div className="text-4xl font-semibold">{heartRate !== null ? heartRate : "N/A"} <span className="text-xl">bpm</span></div>
          <div className="flex items-center pt-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.536a1 1 0 10-1.414-1.414L9 9.172 7.879 8.05a1 1 0 00-1.415 1.415l2 2a1 1 0 001.415 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-yellow-400 ml-1">Good for today</span>
          </div>
        </div>

        <div className="mt-4">
          <canvas ref={ecgRef} width="300" height="70" className="w-full rounded-md shadow-inner"></canvas>
        </div>
      </div>

      <div className="content centered">
        <div className="progress-bar-container">
          <OxygenLevelGraph spo2={spo2} />
        </div>
      </div>

      <div className="centered">
        <button className="know-more-button"
          onClick={() => navigate("/Knowmore")}
        >Know More</button>
      </div>
    </div>
  );
};

export default Browse;
