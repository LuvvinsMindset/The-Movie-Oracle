import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { verifyAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userEmail = req.headers['user-email'] as string;
  
  try {
    const isAdmin = verifyAdmin(userEmail);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const stmt = db.prepare(
      `SELECT * FROM activities 
       ORDER BY created_at DESC 
       LIMIT 100`
    );
    const activities = stmt.all();

    return res.status(200).json({ activities });
  } catch (error) {
    console.error('Error in activities endpoint:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 