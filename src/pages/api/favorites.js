import db from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { email, movieId, movieTitle } = req.body;

  if (method === 'POST') {
    // Add a favorite movie
    try {
      const stmt = db.prepare('INSERT INTO favorites (email, movieId, movieTitle) VALUES (?, ?, ?)');
      stmt.run(email, movieId, movieTitle);
      res.status(200).json({ message: 'Movie added to favorites' });
    } catch (error) {
      console.error('Error adding favorite movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (method === 'GET') {
    // Retrieve favorite movies for the user
    try {
      const { email } = req.query;
      const stmt = db.prepare('SELECT movieId, movieTitle FROM favorites WHERE email = ?');
      const favorites = stmt.all(email);
      res.status(200).json({ favorites });
    } catch (error) {
      console.error('Error retrieving favorite movies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}