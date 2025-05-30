import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

interface FavoriteActor {
  id: number;
  actor_id: number;
  actor_name: string;
  profile_path?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { email, actorId, actorName, profilePath } = req.body;

  if (method === 'GET') {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stmt = db.prepare('SELECT actor_id, actor_name, profile_path FROM favorite_actors WHERE user_id = ?');
      const favorites = stmt.all(user.id) as FavoriteActor[];

      res.status(200).json({ favorites });
    } catch (error) {
      console.error('Error fetching favorite actors:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (method === 'POST') {
    if (!email || !actorId || !actorName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const checkStmt = db.prepare('SELECT id FROM favorite_actors WHERE user_id = ? AND actor_id = ?');
      const existing = checkStmt.get(user.id, actorId);

      if (existing) {
        return res.status(409).json({ error: 'Actor is already in favorites' });
      }

      const stmt = db.prepare('INSERT INTO favorite_actors (user_id, actor_id, actor_name, profile_path) VALUES (?, ?, ?, ?)');
      stmt.run(user.id, actorId, actorName, profilePath || null);

      res.status(201).json({ message: 'Favorite actor added successfully' });
    } catch (error) {
      console.error('Error adding favorite actor:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (method === 'DELETE') {
    if (!email || !actorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stmt = db.prepare('DELETE FROM favorite_actors WHERE user_id = ? AND actor_id = ?');
      stmt.run(user.id, actorId);

      res.status(200).json({ message: 'Favorite actor deleted successfully' });
    } catch (error) {
      console.error('Error deleting favorite actor:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
} 