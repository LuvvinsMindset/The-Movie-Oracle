import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { logActivity } from '@/lib/activity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const stmt = db.prepare(
      'INSERT INTO support_messages (email, subject, message) VALUES (?, ?, ?)'
    );
    stmt.run(email, subject, message);

    await logActivity(
      'message',
      `New support message from ${email}: ${subject}`,
      email
    );

    res.status(201).json({ message: 'Support message sent successfully' });
  } catch (error) {
    console.error('Error saving support message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 