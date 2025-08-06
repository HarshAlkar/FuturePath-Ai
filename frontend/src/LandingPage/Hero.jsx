import React from 'react';
import { Link } from 'react-router-dom';
import hero_bg from '../assets/body_bg.svg';
import hero_video from '../assets/hero_bg.webm';
import finpilot_hero from '../assets/FinPilot_hero.svg';

const Hero = () => {
  return (
    <div className="h-screen w-full bg-cover bg-center text-white flex items-center justify-center px-10" style={{ backgroundImage: `url(${hero_bg})` }}>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-10">
        
        {/* Left Section - Text */}
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-black font-anton text-green-800">
            FinPilot – Your AI-Powered Financial Wingman
          </h1>
          <p className="text-lg md:text-xl mt-4 font-outfit text-green-800">
            Track smarter. Spend wiser. Save better — powered by AI.
          </p>
          <p className="text-lg md:text-xl mt-2 font-outfit text-green-800">
            Log your spending with voice, SMS, or manual entry — let AI handle the insights and savings plan.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/get-started">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-400/20">
                Get Started Free
              </button>
            </Link>
            <button className="bg-transparent hover:bg-white/10 text-green-800 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-green-800/20 hover:border-green-800/40 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Section - Video/Image */}
        <div className="flex-1 w-full h-auto transition-all duration-200 ease-in-out hover:-translate-y-2">
          <div className="w-full mx-[60px] h-80 rounded-2xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-full object-cover"
              src={hero_video}
              autoPlay
              muted
              loop
              playsInline
            />
            {/* Fallback image if video doesn't load */}
            <img 
              src={finpilot_hero} 
              alt="FinPilot Hero" 
              className="w-full h-full object-cover hidden"
              onError={(e) => {
                e.target.style.display = 'block';
                e.target.previousElementSibling.style.display = 'none';
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
