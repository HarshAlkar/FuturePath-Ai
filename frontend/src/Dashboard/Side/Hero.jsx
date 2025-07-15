import React from 'react';
// import dashboard_hero from '../../assets/dashboard_hero.webm';

const Hero = () => {
  return (
    <div className="h-screen w-full mt-3 px-10 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-10">
        
        {/* Left Section - Text and Cards */}
        <div className="flex-1">
          <h1 className="text-5xl font-black font-anton text-green-800 whitespace-nowrap">
            Welcome, Manish!
          </h1>
          <p className="text-lg md:text-xl mt-4 font-outfit font-semibold text-green-800">
            Your personal finance command center is live.
          </p>
          <p className="text-lg md:text-xl mt-2 font-outfit font-semibold text-green-800 whitespace-nowrap">
            Track effortlessly. Spot patterns. Spend smart. Powered by AI.
          </p>

          {/* Feature Cards */}
          <div className="mt-6 space-y-4">
            {/* Spend Overview */}
            <div className="bg-white w-[35em] max-h-[160px] p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-green-800">Spend Overview</h2>
                <span className="text-xl font-bold text-green-800">→</span>
              </div>
              <div className="space-y-1 text-green-700">
                <div className="flex justify-between"><span>Income</span><span>₹2000</span></div>
                <div className="flex justify-between"><span>Spent</span><span>₹800</span></div>
                <div className="flex justify-between"><span>Saved</span><span>₹1200</span></div>
              </div>
            </div>

            {/* Goals Summary */}
            <div className="bg-white w-[35em] max-h-[160px] p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-green-800">Goals Summary</h2>
                <span className="text-xl font-bold text-green-800">→</span>
              </div>
              <div className="space-y-1 text-green-700">
                <div className="flex justify-between"><span>iPhone</span><span>₹2000</span></div>
                <div className="flex justify-between"><span>Goa Trip</span><span>₹800</span></div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white w-[35em] max-h-[160px] p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-green-800">Insights</h2>
                <span className="text-xl font-bold text-green-800">→</span>
              </div>
              <div className="space-y-1 text-green-700">
                <div className="flex justify-between"><span>Shopping (last month)</span><span>-20%</span></div>
                <div className="flex justify-between"><span>Savings (last month)</span><span>+20%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Video */}
        {/* <div className="flex justify-center items-center w-full md:w-1/2 px-4">
          <video
            className="w-full max-w-[36em] h-auto rounded-xl transition-all duration-300 hover:scale-105"
            src={dashboard_hero}
            autoPlay
            muted
            loop
            playsInline
          />
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
