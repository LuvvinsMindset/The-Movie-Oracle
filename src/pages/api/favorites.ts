// /pages/api/favorites.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/utils/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { email, movieId, title } = req.body;

  if (!email || !movieId || !title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const { db } = await connectToDatabase();

  try {
    await db.collection('favorites').updateOne(
      { email },
      { $addToSet: { movies: { movieId, title } } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Favorite added' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
