import { NextApiRequest, NextApiResponse } from 'next';

// Response cache for faster repeated requests
const cache = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { issue, prompt } = req.body;

    console.log('🤖 AI Request received');

    // Check cache first
    const cacheKey = issue?.id;
    if (cache.has(cacheKey)) {
      console.log('⚡ Returning cached response');
      return res.status(200).json({ suggestion: cache.get(cacheKey) });
    }

    // Optimized shorter prompt
    const aiPrompt = prompt || `Fix: ${issue?.description?.substring(0, 150) || issue?.help}`;

    // Call Ollama with OPTIMIZED settings
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3.5',
        prompt: aiPrompt,
        stream: false,
        options: {
          temperature: 0.1,        // Lower = faster
          top_k: 30,               // Limit vocabulary
          top_p: 0.8,              // Nucleus sampling
          repeat_penalty: 1.0,     // No repetition penalty
          num_predict: 80,         // Shorter response
          num_ctx: 1024,           // Smaller context window
          num_thread: 4            // CPU threads
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    
    // Trim response if too long
    const suggestion = data.response?.substring(0, 300) || 'Fix the issue based on WCAG guidelines';

    // Store in cache for future requests
    cache.set(cacheKey, suggestion);

    return res.status(200).json({ suggestion });

  } catch (error: any) {
    console.error('❌ AI Error:', error.message);
    
    // Quick fallback (no wait)
    return res.status(200).json({ 
      suggestion: 'Quick fix: Add proper ARIA attributes or semantic HTML elements.'
    });
  }
}