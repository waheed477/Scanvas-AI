import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { corsMiddleware } from '../../lib/cors';

const DATA_FILE = path.join(process.cwd(), 'audits.json');

function readAudits(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading audits:', e);
  }
  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const audits = readAudits();
      res.status(200).json(audits);
    } catch (error: any) {
      console.error('❌ Error fetching history:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch history' });
    }
  });
}
