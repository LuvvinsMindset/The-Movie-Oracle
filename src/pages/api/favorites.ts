import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { email, movieId, movieTitle } = req.body;

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

      const stmt = db.prepare('SELECT movie_id, movie_title FROM favorite_movies WHERE user_id = ?');
      const favorites = stmt.all(user.id);

      res.status(200).json({ favorites });
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (method === 'POST') {
    if (!email || !movieId || !movieTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stmt = db.prepare('INSERT INTO favorite_movies (user_id, movie_id, movie_title) VALUES (?, ?, ?)');
      stmt.run(user.id, movieId, movieTitle);

      res.status(201).json({ message: 'Favorite movie added successfully' });
    } catch (error) {
      console.error('Error adding favorite movie:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (method === 'DELETE') {
    if (!email || !movieId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stmt = db.prepare('DELETE FROM favorite_movies WHERE user_id = ? AND movie_id = ?');
      stmt.run(user.id, movieId);

      res.status(200).json({ message: 'Favorite movie deleted successfully' });
    } catch (error) {
      console.error('Error deleting favorite movie:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
