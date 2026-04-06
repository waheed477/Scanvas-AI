import { NextApiRequest, NextApiResponse } from 'next';
import { corsMiddleware } from '../../lib/cors';

// Response cache for faster repeated requests
const cache = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { issue, prompt } = req.body;

      console.log('🤖 AI Request received');

      // Check cache first
      const cacheKey = issue?.id;
      if (cache.has(cacheKey)) {
        console.log('⚡ Returning cached response');
        res.status(200).json({ suggestion: cache.get(cacheKey) });
        return;
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
            temperature: 0.1,
            top_k: 30,
            top_p: 0.8,
            repeat_penalty: 1.0,
            num_predict: 80,
            num_ctx: 1024,
            num_thread: 4
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

      res.status(200).json({ suggestion });

    } catch (error: any) {
      console.error('❌ AI Error:', error.message);
      
      // Quick fallback (no wait)
      res.status(200).json({ 
        suggestion: 'Quick fix: Add proper ARIA attributes or semantic HTML elements.'
      });
    }
  });
}
