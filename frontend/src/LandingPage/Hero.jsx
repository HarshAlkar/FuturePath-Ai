import React from 'react';
import hero_img from '../assets/hero_bg.webm';
import hero_bg from '../assets/body_bg.svg'

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
        </div>

        {/* Right Section - Video */}
        <div className="flex-1 w-full h-auto transition-all duration-200 ease-in-out hover:-translate-y-2">
          <video
            className="w-full mx-[60px]"
            src={hero_img}
            autoPlay
            muted
            loop
            playsInline
          >
          </video>
        </div>


      </div>
    </div>
  );
};

export default Hero;
