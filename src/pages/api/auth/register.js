// api/auth/register.js
import db from '../../../lib/db';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const existingUser = stmt.get(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert the new user
    const insertStmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    insertStmt.run(email, password, 'user');

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
