import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Hero = () => {
  const navigate = useNavigate();

  return (
      <div className='wrapper md:px-20 lg:px-40'>
        <Navbar/>

      </div>
  );
};

export default Hero;
