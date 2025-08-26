export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  
  try {
    switch (path) {
      case 'start':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const { mode } = req.body;
        console.log("📦 Received mode:", mode);
        const sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 10);
        return res.status(200).json({ id: sessionId });

      case 'sessions':
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        // For now, return empty array since we're not using Supabase in demo
        return res.status(200).json([]);

      case 'save':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        // For demo, just return success
        return res.status(200).json({ message: "Message saved (demo mode)" });

      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
