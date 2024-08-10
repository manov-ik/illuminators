import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <section className=" flex items-center justify-center h-screen ">
        <div className="text-center">
          <div className="text-white">
            <p className="text-4xl md:text-6xl p-3 font-bold">
              Track your Health Journey with Ease
            </p>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-md text-lg md:text-xl  transition"
              onClick={() => navigate("/Login")}
            >
              Register
            </button>
            <button
              className=" text-white px-6 py-3 rounded-md text-lg md:text-xl  transition"
              onClick={() => navigate("/Browse")}
            >
              Explore
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Hero;
