import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { moviesService } from '@/movies/MoviesService';
import { logActivity } from '@/lib/activity';

interface FavoriteMovie {
  id: number;
  movie_id: number;
  movie_title: string;
  poster_path?: string;
}

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
      const favorites = stmt.all(user.id) as Omit<FavoriteMovie, 'poster_path'>[];

      // Fetch movie details for each favorite movie
      const favoritesWithDetails = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const movieDetails = await moviesService.getMovieDetails(favorite.movie_id);
            return {
              ...favorite,
              poster_path: movieDetails.poster_path
            };
          } catch (error) {
            console.error(`Error fetching details for movie ${favorite.movie_id}:`, error);
            return favorite;
          }
        })
      );

      res.status(200).json({ favorites: favoritesWithDetails });
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

      // Check if movie is already in favorites
      const checkStmt = db.prepare('SELECT id FROM favorite_movies WHERE user_id = ? AND movie_id = ?');
      const existing = checkStmt.get(user.id, movieId);

      if (existing) {
        return res.status(409).json({ error: 'Movie is already in favorites' });
      }

      const stmt = db.prepare('INSERT INTO favorite_movies (user_id, movie_id, movie_title) VALUES (?, ?, ?)');
      stmt.run(user.id, movieId, movieTitle);

      // Log the favorite movie activity
      await logActivity(
        'favorite',
        `Added movie to favorites: ${movieTitle}`,
        email
      );

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

      // Get movie title before deleting
      const movieStmt = db.prepare('SELECT movie_title FROM favorite_movies WHERE user_id = ? AND movie_id = ?');
      const movie = movieStmt.get(user.id, movieId);

      const stmt = db.prepare('DELETE FROM favorite_movies WHERE user_id = ? AND movie_id = ?');
      stmt.run(user.id, movieId);

      if (movie) {
        // Log the favorite movie removal activity
        await logActivity(
          'favorite',
          `Removed movie from favorites: ${movie.movie_title}`,
          email
        );
      }

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
