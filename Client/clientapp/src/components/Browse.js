import React, { useEffect, useRef } from 'react';
import Navbar from "./Navbar"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the CSS for CircularProgressbar
import OxygenLevelGraph from './Oxygengraph';
import { useNavigate } from 'react-router-dom';

const Browse = () => {
  const pulseRate = 82;  // Pulse rate
  const hrv = 56;        // Heart Rate Variability
  const tension = 44;    // Tension level

  // Refs for the ECG animation
  const ecgRef = useRef(null);

  useEffect(() => {
    const canvas = ecgRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set the ECG background color
    ctx.fillStyle = '#222'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the ECG line color
    ctx.strokeStyle = "#00FF00"; // Bright green color for ECG line
    ctx.lineWidth = 2;

    let x = 0;
    let points = [];

    const speed = 2;

    function generateAmplitude(x) {
      // Simulate an uneven ECG wave with smoother rounded spikes
      if (x % 100 < 10) {
        return 20 + Math.random() * 20; // Sharp spike up
      } else if (x % 100 > 90) {
        return 50 + Math.random() * 10; // Rounded peak
      } else {
        return 50 + Math.sin(x / 10) * 5 + Math.random() * 3; // Baseline with slight variations
      }
    }

    function drawECG() {
      // Clear the canvas and redraw the background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      // Generate the next point in the ECG wave
      const amplitude = generateAmplitude(x);
      points.push({ x, y: amplitude });

      // Move the x position
      x += speed;

      // Remove old points that are off the canvas
      if (points.length > canvas.width / speed) {
        points.shift();
      }

      // Draw the ECG line with smooth transitions between points
      if (points.length > 1) {
        ctx.moveTo(points[0].x, points[0].y); // Start at the first point
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // Draw the last two points
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
 const navigate=useNavigate();
  return (
    <div className='wrapper md:px-20 lg:px-40'>
      <Navbar />
      <div className='days-bar'>
        <div className='day active'>
          <div className='day-name'>Mon</div>
          <div className='day-date'>02</div>
        </div>
        <div className='day'>
          <div className='day-name'>Sun</div>
          <div className='day-date'>01</div>
        </div>
        <div className='day'>
          <div className='day-name'>Tue</div>
          <div className='day-date'>03</div>
        </div>
        <div className='day'>
          <div className='day-name'>Wed</div>
          <div className='day-date'>04</div>
        </div>
        <div className='day'>
          <div className='day-name'>Thu</div>
          <div className='day-date'>05</div>
        </div>
        <div className='day'>
          <div className='day-name'>Fri</div>
          <div className='day-date'>06</div>
        </div>
        <div className='day'>
          <div className='day-name'>Sat</div>
          <div className='day-date'>07</div>
        </div>
      </div>
      <div className="w-80 mx-auto Pulse p-4 rounded-xl text-white shadow-lg">
       <div className="pb-2">
        <h2 className="text-lg">Pulse Rate</h2>
        <div className="text-4xl font-semibold">{pulseRate} <span className="text-xl">bpm</span></div>
        <div className="flex items-center pt-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.536a1 1 0 10-1.414-1.414L9 9.172 7.879 8.05a1 1 0 00-1.415 1.415l2 2a1 1 0 001.415 0l4-4z" clipRule="evenodd"/></svg>
          <span className="text-yellow-400 ml-1">Good for today</span>
        </div>
       </div>

       <div className="mt-4">
        <canvas ref={ecgRef} width="300" height="70" className="w-full rounded-md shadow-inner"></canvas>
       </div>

       <div className="flex justify-between mt-2 text-sm">
        <span>HRV <strong>{hrv}</strong></span>
        <span>Tension <strong>{tension}%</strong></span>
       </div>
      </div>
    
    
      <div className="content centered">
        <div className="  progress-bar-container">
          <OxygenLevelGraph />
        </div>
      </div>
      <div className="content centered">
       <div className=' progress-bar-container'>
          <div className='progress-bar'>
            <h2 className='text-white pb-4'>Temperature</h2>
            <svg style={{ width: 0, height: 0, position: 'absolute' }}>
              <defs>
                <linearGradient id="redYellowGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f" />
                  <stop offset="50%" stopColor="#8884d8" />
                  <stop offset="100%" stopColor="#0072ff" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgressbar 
              value={pulseRate} 
              text={`${pulseRate}%`}
              styles={buildStyles({
                textColor: 'white',
                pathColor: 'url(#redYellowGreenGradient)',
                trailColor: '#333',
                textSize: '20px',
              })} 
            />
          </div>
     
     </div>
     </div>
      <div className="centered">
        <button className="know-more-button"
        onClick={()=>{
          navigate("/Knowmore")
        }}
        >Know More</button>
      </div>
    </div>
    
  );
};

export default Browse;
