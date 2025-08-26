import React, { useState, useEffect } from 'react';
import { ReactComponent as CortexLogo } from "../utils/CORTEX-LOGO1-2.svg";

const HomePage = () => {
  const [loaded, setLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    // Delay logo animation for dramatic effect
    const timer = setTimeout(() => setLogoLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/example';
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{backgroundColor: '#121217'}}>
      {/* CORTEX-AI in top left */}
      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-3xl font-bold text-white tracking-wider">
          CORTEX-AI
        </h1>
      </div>
      {/* Subtle animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/5 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
        {/* Animated Logo */}
        <div className={`mb-16 transition-all duration-1500 delay-300 ${logoLoaded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-12'}`}>
          <div className="relative inline-block">
            {/* Your actual Cortex Logo with thinking brain animation */}
            <div className="w-96 h-96 mx-auto relative group">
              <div className="transform hover:scale-110 transition-all duration-500" 
                   style={{
                     animation: 'think 3s ease-in-out infinite'
                   }}>
                <CortexLogo className="w-full h-full opacity-95" />
              </div>
              
              {/* Neural activity pulses */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Multiple synaptic flashes */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-80" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-80" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-1/3 right-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-70" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2.5s'}}></div>
              </div>
              
              {/* Electrical activity waves */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1.2s'}}></div>
                <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" style={{animationDelay: '2.2s'}}></div>
              </div>
              
              {/* Subtle brain aura */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-cyan-500/5 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes think {
            0%, 100% { 
              transform: scale(1);
              filter: brightness(1);
            }
            25% { 
              transform: scale(1.02);
              filter: brightness(1.1);
            }
            50% { 
              transform: scale(1.04);
              filter: brightness(1.15);
            }
            75% { 
              transform: scale(1.02);
              filter: brightness(1.1);
            }
          }
        `}</style>

        {/* Main text */}
        <div className={`mb-12 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            LEARN DEEPER.
          </h2>
          <p className="text-base md:text-base text-gray-300 font-light leading-relaxed">
            An AI-powered learning experience built for how your brain actually works.
          </p>
        </div>

        {/* Get Started Button */}
        <div className={`transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white font-semibold text-base transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-3">
              GET STARTED
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;