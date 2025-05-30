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

    const result = db.prepare(
      'SELECT COUNT(*) as count FROM support_messages WHERE status = ?'
    ).get('pending');

    res.status(200).json({ count: result.count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 