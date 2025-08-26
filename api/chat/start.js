export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mode } = req.body;
    console.log("📦 Received mode:", mode);

    // Generate a session ID
    const sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 10);

    res.status(200).json({ id: sessionId });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
}
