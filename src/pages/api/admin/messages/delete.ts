import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Missing message ID' });
    }

    const stmt = db.prepare('DELETE FROM support_messages WHERE id = ?');
    stmt.run(id);

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 