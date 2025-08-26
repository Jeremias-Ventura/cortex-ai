export default function handler(req, res) {
  try {
    // Check environment variables
    const envVars = {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabase: !!process.env.SUPABASE_URL,
      hasPassword: !!process.env.REACT_APP_CHAT_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    };

    res.status(200).json({
      message: "Debug endpoint working!",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: envVars,
      headers: req.headers
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
