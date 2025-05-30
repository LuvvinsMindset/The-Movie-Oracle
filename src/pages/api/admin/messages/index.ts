import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userEmail = req.headers['user-email'] as string;
  if (!userEmail) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = db.prepare('SELECT role FROM users WHERE email = ?').get(userEmail);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const messages = db.prepare(`
      SELECT * FROM support_messages 
      ORDER BY 
        CASE 
          WHEN status = 'pending' THEN 0 
          ELSE 1 
        END,
        created_at DESC
    `).all();

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 