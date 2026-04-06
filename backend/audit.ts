import { NextApiRequest, NextApiResponse } from 'next';
import { runPuppeteerScan, calculateScore, createSummary } from '../../lib/puppeteer-scanner';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'audits.json');

// Helper function to save audit
function saveAudit(audit: any) {
  let audits = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      audits = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading audits file:', e);
  }
  
  audits.unshift(audit); // add to beginning
  fs.writeFileSync(DATA_FILE, JSON.stringify(audits, null, 2));
  console.log(`💾 Audit saved to file: ${audit.id}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ CORS headers - MUST BE FIRST
  res.setHeader('Access-Control-Allow-Origin', 'https://scanvas-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url, standards } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    let formattedUrl = url;
    if (!url.startsWith('http')) {
      formattedUrl = `https://${url}`;
    }

    console.log('🔍 Starting scan for:', formattedUrl);

    const scanResults = await runPuppeteerScan(formattedUrl, standards || ['wcag2aa']);

    if (scanResults.error) {
      const errorAudit = {
        id: Date.now().toString(),
        url: formattedUrl,
        score: 0,
        summary: { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
        error: scanResults.error,
        standards: standards || ['wcag2aa'],
        createdAt: new Date().toISOString()
      };
      saveAudit(errorAudit);
      res.status(200).json(errorAudit);
      return;
    }

    const violations = scanResults.violations || [];
    const score = calculateScore(violations);
    const summary = createSummary(violations);

    const audit = {
      id: Date.now().toString(),
      url: formattedUrl,
      score,
      summary,
      createdAt: new Date().toISOString(),
      results: scanResults,
      standards: standards || ['wcag2aa']
    };

    saveAudit(audit);

    console.log(`✅ Score: ${score}, Violations: ${summary.total}`);

    res.status(201).json(audit);

  } catch (error: any) {
    console.error('❌ Error creating audit:', error);
    res.status(500).json({ error: error.message || 'Failed to create audit' });
  }
}