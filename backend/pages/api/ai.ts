import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ CORS headers
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

    // Mock AI response
    const suggestions = {
      'image-alt': 'Add descriptive alt text to images for screen readers',
      'link-name': 'Add accessible names to links',
      'color-contrast': 'Increase contrast ratio to at least 4.5:1',
      'button-name': 'Add accessible name to button',
      'heading-order': 'Fix heading hierarchy (h1 → h2 → h3)'
    };

    const suggestion = suggestions[issue?.id as keyof typeof suggestions] || 
                       'Review this element for accessibility improvements';

    return res.status(200).json({ suggestion });

  } catch (error: any) {
    console.error('❌ AI Error:', error);
    return res.status(500).json({ error: error.message || 'AI service failed' });
  }
}