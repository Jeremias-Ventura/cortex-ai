import { streamChatResponse, streamChatWithVision } from '../../services/openaiService.js';

export default async function handler(req, res) {
  // Set up Server-Sent Events headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  // Keep connection alive
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat"}\n\n');
  }, 30000);

  try {
    if (req.method === 'GET') {
      // Text-only streaming for GET requests
      const { session_id, message, mode = "example" } = req.query;
      
      console.log(`🔄 Starting stream for session ${session_id}, mode: ${mode}`);
      
      const stream = await streamChatResponse(message, mode);
      
      // Process the streaming response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
        }
      }
      
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      console.log(`✅ Stream completed for session ${session_id}`);
      
    } else if (req.method === 'POST') {
      // Vision streaming for POST requests
      const { session_id, message = "", images = [], mode = "example" } = req.body;
      
      console.log(`🔄 Starting vision stream for session ${session_id}, images: ${images.length}`);
      
      const safeImages = Array.isArray(images)
        ? images.filter((u) => typeof u === "string" && u.startsWith("data:image/"))
        : [];

      let stream;
      if (safeImages.length > 0) {
        // Use vision streaming if images are present
        stream = await streamChatWithVision({
          message,
          images: safeImages,
          mode,
        });
      } else {
        // Use text-only streaming if no images
        stream = await streamChatResponse(message, mode);
      }

      // Process the streaming response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      console.log(`✅ Vision stream completed for session ${session_id}`);
    }
    
  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({
      type: "error",
      error: "Failed to generate response"
    })}\n\n`);
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
}
