import { NextApiRequest, NextApiResponse } from 'next';
import { corsMiddleware } from '../../lib/cors';

// Mock vision scan response

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { url, mode } = req.body;

      console.log(`👁️ Vision scan requested for ${url} in ${mode} mode`);

      // Mock response for now
      const mockIssues = [
        {
          id: "color-contrast-1",
          impact: "moderate",
          description: "Low contrast detected on text elements",
          help: "Increase contrast ratio to at least 4.5:1",
          helpUrl: "https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum",
          nodes: [{"html": "Text elements", "target": ["*"]}]
        }
      ];

      res.status(200).json({
        success: true,
        mode,
        issues: mockIssues,
        count: mockIssues.length
      });

    } catch (error: any) {
      console.error('❌ Vision scan error:', error);
      res.status(500).json({ error: error.message || 'Vision scan failed' });
    }
  });
}
