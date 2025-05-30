import db from '../../../lib/db';
import axios from 'axios';
import { logActivity } from '@/lib/activity';

async function verifyCaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
    return response.data.success;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return false;
  }
}

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, username, password, captchaToken } = req.body;

  try {
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?');
    const existingUser = stmt.get(email, username);

    if (existingUser) {
      return res.status(400).json({ message: existingUser.email === email ? 'Email already exists' : 'Username already exists' });
    }

    const insertStmt = db.prepare('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)');
    insertStmt.run(email, username, password, 'user');

    await logActivity(
      'registration',
      `New user registered: ${username} (${email})`,
      email
    );

    res.status(201).json({ message: 'Registration successful', email, username });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
