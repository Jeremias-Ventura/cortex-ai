// API Configuration - use Vercel API routes for both local and production
export const API_ENDPOINTS = {
  chat: (path) => `/api/chat?path=${path}`,
  chatStream: `/api/chat?path=stream`,
  chatComplete: `/api/chat?path=complete`,
  chatSession: (sessionId) => `/api/chat?path=${sessionId}`,
};

// Always use Vercel API routes (both local and production)
export const getApiUrl = (endpoint) => {
  // Always use the new consolidated API routes
  if (endpoint === '/chat/start') return '/api/chat?path=start';
  if (endpoint === '/chat/sessions') return '/api/chat?path=sessions';
  if (endpoint === '/chat/save') return '/api/chat?path=save';
  if (endpoint === '/chat/complete') return '/api/chat?path=complete';
  if (endpoint === '/chat/stream') return '/api/chat?path=stream';
  // Handle session ID requests
  if (endpoint.match(/^\/chat\/\d+$/)) {
    const sessionId = endpoint.split('/').pop();
    return `/api/chat?path=${sessionId}`;
  }
  return endpoint;
};
