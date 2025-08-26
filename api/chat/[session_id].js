import { getMessages } from '../../services/supabaseService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;
    const { data, error } = await getMessages(session_id);
    if (error) return res.status(500).json({ error });
    res.status(200).json(data);
  } catch (error) {
    console.error('Session messages error:', error);
    res.status(500).json({ error: 'Failed to fetch session messages' });
  }
}
