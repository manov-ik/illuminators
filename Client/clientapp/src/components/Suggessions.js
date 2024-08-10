import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Hero = () => {
  const navigate = useNavigate();

  return (
      <div className='wrapper md:px-20 lg:px-40'>
        <Navbar/>
        <h2 className="text-white text-center text-4xl">Insights</h2>
      </div>
  );
};

export default Hero;
