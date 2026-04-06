import { NextApiRequest, NextApiResponse } from 'next';

export function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  res.setHeader('Access-Control-Allow-Origin', 'https://scanvas-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}
