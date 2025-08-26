import { chatWithVision } from '../../services/openaiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message = "", images = [], mode = "example" } = req.body;

    console.log("Server got images:", images?.length);
    const safeImages = Array.isArray(images)
      ? images.filter((u) => typeof u === "string" && u.startsWith("data:image/"))
      : [];

    const reply = await chatWithVision({ message, images: safeImages, mode });
    res.json({ response: reply });
  } catch (err) {
    console.error('chat/complete error:', err);
    res.status(500).json({ error: 'Failed to complete chat.' });
  }
}
