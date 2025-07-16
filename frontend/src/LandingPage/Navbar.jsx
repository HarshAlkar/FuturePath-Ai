import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="absolute mt-5  top-0 left-0 z-50 w-[97%] mx-[20px] h-[90px] flex items-center justify-between px-6 bg-transparent hover">
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img className="w-15" src="/FinPilot_logo.svg" alt="FinPilot Logo" />
          <h1 className="text-3xl font-black font-anton uppercase tracking-widest text-green-800 ml-2">
            FinPilot
          </h1>
        </a>
      </div>

      <ul className="flex list-none items-center text-lg text-black gap-6">
        <li className="text-gray-800 hover:text-green-400 cursor-pointer">Home</li>
        <li className="text-gray-800 hover:text-green-400 cursor-pointer">About Us</li>
        <li className="text-gray-800 hover:text-green-400 cursor-pointer">Features</li>
        <li className="text-gray-800 hover:text-green-400 cursor-pointer">Testimonials</li>
        <li className="text-gray-800 hover:text-green-400 cursor-pointer">Contact Us</li>
        <Link to="/get-started">
          <button className="px-6 py-2 text-white bg-green-800 rounded-full border border-green-700 hover:bg-black hover:text-white transition-all duration-400 ease-in-out text-sm sm:text-base">
            Get Started
          </button>
        </Link>
      </ul>

    </nav>
  );
};

export default Navbar;
