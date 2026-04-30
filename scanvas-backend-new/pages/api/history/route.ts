import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'audits.json');

// Helper to read audits
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

// Helper to write audits
function writeAudits(audits: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(audits, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const audits = readAudits();
    return res.status(200).json(audits);
  } catch (error: any) {
    console.error(' Error fetching history:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch history' });
  }
}