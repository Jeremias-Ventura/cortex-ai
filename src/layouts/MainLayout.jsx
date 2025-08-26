// ./layouts/MainLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ReactComponent as CortexLogo } from "../utils/CORTEX-LOGO1-2.svg";
import { ReactComponent as ExampleIcon } from "../utils/exampleIcon.svg";
import { ReactComponent as DeepIcon } from "../utils/deepIcon.svg";
import { ReactComponent as SidebarOpen } from "../utils/sidebarOpen.svg";
import { ReactComponent as SidebarClose } from "../utils/sidebarClose.svg";
import { getApiUrl } from "../config/api";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(getApiUrl("/chat/sessions"));
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  const onSelectSession = (id) => {
    setCurrentSessionId(id);
  };

  const handleStartNewSession = async () => {
    try {
      const res = await fetch(getApiUrl("/chat/start"), {
        method: "POST",
      });
      const newSession = await res.json();
      if (newSession?.id) {
        setSessions((prev) => [...prev, newSession]);
        onSelectSession(newSession.id);
        navigate(location.pathname); // stay on current page
      }
    } catch (e) {
      console.error("Failed to start new session:", e);
    }
  };

  const toggleSidebar = () => setSidebarVisible((v) => !v);

  // Helper function to check if current mode is active
  const isExampleMode = location.pathname === '/example';
  const isDeepMode = location.pathname === '/deep';

  return (
    <div className="flex h-screen bg-side text-white overflow-hidden relative">
      {/* Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="group relative w-8 h-8 bg-black/20 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {sidebarVisible ? (
            <SidebarClose className="w-5 h-5 transition-all duration-300" />
          ) : (
            <SidebarOpen className="w-5 h-5 transition-all duration-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarVisible ? "w-64" : "w-16"
        } h-full bg-gradient-to-b from-side via-side to-side/95 text-white flex flex-col justify-between transition-all duration-500 ease-out overflow-hidden border-r border-white/10 backdrop-blur-xl shadow-2xl`}
      >
        <div className="p-4">
          <div className="mt-12 mb-8">
            <div
              className={`transform hover:scale-105 transition-transform duration-300 ${
                sidebarVisible ? "flex justify-center" : "flex justify-center"
              }`}
            >
              {sidebarVisible ? (
                <CortexLogo className="w-32 h-32 drop-shadow-xl" />
              ) : (
                <CortexLogo className="w-10 h-10 drop-shadow-xl" />
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-6">
            {/* Example-Based */}
            <div className="flex flex-col space-y-2">
              <div
                className={`group flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer relative ${
                  !sidebarVisible ? "justify-center" : ""
                } ${isExampleMode ? "bg-white/5" : ""}`}
                onClick={() => navigate("/example")}
              >
                {/* Active Mode Indicator Dot - Expanded Sidebar */}
                {sidebarVisible && (
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isExampleMode 
                      ? "bg-purple-400 shadow-lg shadow-purple-400/50 animate-pulse" 
                      : "bg-transparent"
                  }`}></div>
                )}
                
                <div
                  className={`p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 relative ${
                    !sidebarVisible
                      ? "w-8 h-8 flex items-center justify-center"
                      : ""
                  }`}
                >
                  <ExampleIcon
                    className={`${sidebarVisible ? "w-6 h-6" : "w-5 h-5"}`}
                  />
                  
                  {/* Collapsed Mode Indicator - Inside Icon Container */}
                  {!sidebarVisible && isExampleMode && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
                  )}
                </div>
                
                {sidebarVisible && (
                  <span className={`font-semibold text-base group-hover:text-purple-300 transition-colors duration-300`}>
                    Example-Based
                  </span>
                )}
              </div>

              {/* Example sessions */}
              {sidebarVisible && (
                <div className="ml-6 space-y-2">
                  {sessions.map((session, index) => (
                    <button
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2 ${
                        currentSessionId === session.id
                          ? "bg-white/20 text-purple-300"
                          : "text-gray-300"
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      Chat Log {session.id}
                    </button>
                  ))}

                  <button
                    onClick={handleStartNewSession}
                    className="group flex items-center gap-2 px-4 py-2 text-xs text-purple-400 hover:text-purple-300 transition-all duration-300 rounded-xl hover:bg-white/5"
                  >
                    <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                      +
                    </span>
                    New Chat
                  </button>
                </div>
              )}
            </div>

            {/* Deep-Dive - DISABLED */}
            <div className="flex flex-col space-y-2">
              <div
                className={`group flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 cursor-not-allowed opacity-60 relative ${
                  !sidebarVisible ? "justify-center" : ""
                } ${isDeepMode ? "bg-white/5" : ""}`}
              >
                {/* Active Mode Indicator Dot - Expanded Sidebar */}
                {sidebarVisible && (
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isDeepMode 
                      ? "bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" 
                      : "bg-transparent"
                  }`}></div>
                )}
                
                <div
                  className={`p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl transition-transform duration-300 relative ${
                    !sidebarVisible
                      ? "w-8 h-8 flex items-center justify-center"
                      : ""
                  }`}
                >
                  <DeepIcon
                    className={`${sidebarVisible ? "w-6 h-6" : "w-5 h-5"}`}
                  />
                  
                  {/* Collapsed Mode Indicator - Inside Icon Container */}
                  {!sidebarVisible && isDeepMode && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 animate-pulse"></div>
                  )}
                </div>
                
                {sidebarVisible && (
                  <div className="flex flex-col">
                    <span className={`font-semibold text-BASE text-gray-400 transition-colors duration-300`}>
                      Deep-Dive
                    </span>
                    <span className="text-xs text-emerald-400 font-medium animate-pulse">
                      Coming Soon!
                    </span>
                  </div>
                )}
              </div>

              {/* Coming Soon message for collapsed sidebar */}
              {!sidebarVisible && (
                <div className="flex justify-center">
                  <span className="text-xs text-emerald-400 font-medium animate-pulse writing-mode-vertical text-center">
                    Soon!
                  </span>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Login / CTA */}
        <div className="p-4">
          <div
            className={`group flex items-center ${
              sidebarVisible ? "justify-between" : "justify-center"
            } p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer`}
          >
            {sidebarVisible ? (
              <>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                  Log in
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 group-hover:text-white transition-all duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Main Content area */}
      <div className="flex-1 min-h-0 p-5 overflow-hidden transition-all duration-500 ease-out">
        <div className="bg-main rounded-[30px] h-full w-full max-h-full overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl border border-white/10 relative">
          {/* Mode Indicator */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              location.pathname === '/example' 
                ? 'bg-purple-400 shadow-lg shadow-purple-400/50'
                : location.pathname === '/deep'
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                  : 'bg-gray-400/60'
            }`}></div>
            <span className={`text-sm font-medium transition-colors duration-300 ${
              location.pathname === '/example' 
                ? 'text-purple-300'
                : location.pathname === '/deep'
                  ? 'text-emerald-300'
                  : 'text-gray-400'
            }`}>
              {location.pathname === '/example' 
                ? 'Example-Based'
                : location.pathname === '/deep'
                  ? 'Deep-Dive'
                  : 'Select Mode'
              }
            </span>
          </div>
          
          {/* Render child routes here and pass shared data via context */}
          <Outlet
            context={{
              sessionId: currentSessionId,
              onSessionCreated: setCurrentSessionId,
              sessions,
              onSelectSession,
              handleStartNewSession,
            }}
          />
        </div>
      </div>
    </div>
  );
}