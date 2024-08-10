import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(prevToggle => !prevToggle);
  };

  return (
    <header>
      <div className="w-full h-20 flex justify-between items-center text-white text-xl px-8 md:px-16 shadow-md">
        {/* Logo section */}
        <div className="flex items-center">
          <p className="text-2xl font-bold">
            HealthCare
            <span className="text-red-500">Provider</span>
          </p>
        </div>

       

        
        
      </div>
    </header>
  );
};

export default Navbar;
