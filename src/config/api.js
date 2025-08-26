// API Configuration - automatically switches between local dev and production
const isDevelopment = process.env.NODE_ENV === 'development';

const API_BASE = isDevelopment 
  ? 'http://localhost:3001' 
  : '';

export const API_ENDPOINTS = {
  chat: `${API_BASE}/api/chat`,
  chatStream: `${API_BASE}/api/chat/stream`,
  chatStart: `${API_BASE}/api/chat/start`,
  chatSave: `${API_BASE}/api/chat/save`,
  chatSessions: `${API_BASE}/api/chat/sessions`,
  chatComplete: `${API_BASE}/api/chat/complete`,
  chatSession: (sessionId) => `${API_BASE}/api/chat/${sessionId}`,
  testSupabase: `${API_BASE}/api/chat/test-supabase`,
};

// For backward compatibility during development
export const getApiUrl = (endpoint) => {
  if (isDevelopment) {
    // In development, use the old server endpoints
    return `http://localhost:3001${endpoint}`;
  }
  // In production, use the new API routes
  return endpoint;
};
