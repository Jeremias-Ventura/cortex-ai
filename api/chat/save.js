import { saveMessage } from '../../services/supabaseService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id, role, message } = req.body;

    console.log("⚠️ Skipping Supabase save. Would have saved:", {
      session_id,
      role,
      message,
    });

    // Just return success without doing anything for demo
    res.status(200).json({ message: "Temporarily skipping DB save" });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
}
