// API configuration - use live Express server for production, localhost for development
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE = isDevelopment ? 'http://localhost:3001' : 'https://cortex-ai-server.vercel.app';

export const API_ENDPOINTS = {
  chat: `${API_BASE}/chat`,
  chatStream: `${API_BASE}/chat/stream`,
  chatComplete: `${API_BASE}/chat/complete`,
  chatSession: (sessionId) => `${API_BASE}/chat/${sessionId}`,
};

// Function to get API URLs with logging
export const getApiUrl = (endpoint) => {
  const fullUrl = `${API_BASE}${endpoint}`;
  if (isDevelopment) {
    console.log(`🔗 API Call: ${endpoint} -> ${fullUrl} (Development)`);
  } else {
    console.log(`🚀 API Call: ${endpoint} -> ${fullUrl} (Production)`);
  }
  return fullUrl;
};
