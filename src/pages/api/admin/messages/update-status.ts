import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const stmt = db.prepare(
      'UPDATE support_messages SET status = ? WHERE id = ?'
    );
    stmt.run(status, id);

    res.status(200).json({ message: 'Message status updated successfully' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 