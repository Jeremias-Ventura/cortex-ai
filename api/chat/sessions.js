import { supabase } from '../../services/supabaseService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase.from("chat_sessions").select("*");
    if (error) return res.status(500).json({ error });
    res.status(200).json(data);
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}
