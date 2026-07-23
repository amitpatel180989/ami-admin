import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Anthropic API
    const response = await client.messages.create({
      model: 'claude-opus-4-20250805',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Extract the text response
    const assistantMessage = response.content[0].text;

    // Return response in the format your frontend expects
    return res.status(200).json({
      success: true,
      reply: assistantMessage,
      content: [{ text: assistantMessage }],
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific Anthropic API errors
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    return res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
}