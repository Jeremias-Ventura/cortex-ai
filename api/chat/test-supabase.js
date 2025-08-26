import { supabase } from '../../services/supabaseService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .limit(1);
    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Supabase test failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
