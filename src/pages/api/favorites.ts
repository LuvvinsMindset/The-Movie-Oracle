import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { email, movieId, movieTitle, posterPath } = req.body;

  if (method === 'POST') {
    if (!email || !movieId || !movieTitle || !posterPath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Fetch user_id based on the email
      const userStmt = db.prepare('SELECT id FROM users WHERE email = ?');
      const user = userStmt.get(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = user.id;

      // Insert favorite movie with the user_id
      const insertStmt = db.prepare(`
        INSERT INTO favorite_movies (user_id, movie_id, movie_title, poster_path, email)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertStmt.run(userId, movieId, movieTitle, posterPath, email);

      res.status(200).json({ message: 'Favorite movie added successfully' });
    } catch (error) {
      console.error('Error adding favorite movie:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
