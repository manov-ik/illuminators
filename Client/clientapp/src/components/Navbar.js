import React, { useState } from "react";
import { NavData } from "../data/Navdata.js";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  // active navLinks 
  const activeLink = "border-b-2 border-red-500 text-red-500 px-4 py-2";
  const normalLink = "text-white px-4 py-2 hover:text-red-500 transition";

  return (
    <React.Fragment>
      <section>
        <div className="w-full h-20 flex justify-between items-center text-white text-xl px-8 md:px-16 shadow-md">
          {/* logo section */}
          <div className="flex items-center">
            <p className="text-2xl font-bold">
             Pulse
              <span className="text-red-500">Pro</span>
            </p>
          </div>
          
          {/* large screen */}
          <div className="hidden md:flex">
            <div className="flex space-x-6">
              {NavData.map((item, index) => (
                <NavLink 
                  key={index} 
                  to={item.path} 
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* mobile screen */}
          <section className='md:hidden'>
            <div className="flex items-center">
              <div className="text-3xl cursor-pointer" onClick={handleToggle}>
                {toggle ? <FaTimes /> : <FaBars />}
              </div>
            </div>
            {toggle && (
              <div className="absolute top-20 right-0 bg-gray-950 text-white w-full shadow-lg z-50">
                <div className="flex flex-col items-center py-4">
                  {NavData.map((item, index) => (
                    <NavLink 
                      key={index} 
                      to={item.path} 
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                      onClick={handleToggle}
                    >
                      <span className="block px-6 py-3 text-lg">{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Navbar;
