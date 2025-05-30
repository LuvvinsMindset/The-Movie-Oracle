import db from '../../../lib/db';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, newUsername } = req.body;

  try {
    const checkStmt = db.prepare('SELECT * FROM users WHERE username = ? AND email != ?');
    const existingUser = checkStmt.get(newUsername, email);

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const updateStmt = db.prepare('UPDATE users SET username = ? WHERE email = ?');
    const result = updateStmt.run(newUsername, email);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Username changed successfully' });
  } catch (error) {
    console.error('Error changing username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 