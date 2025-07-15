import React from 'react';

const About = () => {
  return (
    <div className="w-[60em] mx-auto -mt-[40px] bg-white rounded-[20px] shadow-lg p-8 transition-all duration-[5000ms] ease-in-out" data-aos="fade-up">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-4 font-anton">
        About FinPilot
      </h1>

        <p className="text-gray-700 text-lg font-outfit leading-relaxed">
            ✓ FinPilot is your AI-powered financial wingman built to make personal finance effortless, smart, and intuitive.
        </p>
        <p className="text-gray-700 text-lg font-outfit leading-relaxed">
            ✓ From logging daily expenses via voice, SMS, or manual input to generating personalized savings plans with AI,
            FinPilot empowers users to track, analyze, and grow their money.
        </p>
        <p className="text-gray-700 text-lg font-outfit leading-relaxed">
            ✓ Whether you're a student managing pocket money or a working professional planning for the future,
            FinPilot provides a clean, all-in-one dashboard to stay in control of your finances.
        </p>
    </div>
  );    
};

export default About;
