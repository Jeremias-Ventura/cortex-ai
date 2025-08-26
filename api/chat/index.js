import { getChatResponse } from '../../services/openaiService.js';
import { saveMessage } from '../../services/supabaseService.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, mode } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await getChatResponse(message, mode);
    res.status(200).json({ response: reply });
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
