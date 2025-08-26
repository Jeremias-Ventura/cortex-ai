// API Configuration - automatically switches between local dev and production
const isDevelopment = process.env.NODE_ENV === 'development';

const API_BASE = isDevelopment 
  ? 'http://localhost:3001' 
  : '';

export const API_ENDPOINTS = {
  chat: (path) => `${API_BASE}/api/chat?path=${path}`,
  chatStream: `${API_BASE}/api/chat/stream`,
  chatComplete: `${API_BASE}/api/chat/complete`,
  chatSession: (sessionId) => `${API_BASE}/api/chat/${sessionId}`,
};

// For backward compatibility during development
export const getApiUrl = (endpoint) => {
  if (isDevelopment) {
    // In development, use the old server endpoints
    return `http://localhost:3001${endpoint}`;
  }
  // In production, use the new consolidated API routes
  if (endpoint === '/chat/start') return '/api/chat?path=start';
  if (endpoint === '/chat/sessions') return '/api/chat?path=sessions';
  if (endpoint === '/chat/save') return '/api/chat?path=save';
  return endpoint;
};
