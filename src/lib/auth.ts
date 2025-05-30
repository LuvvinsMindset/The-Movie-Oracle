import db from './db';

interface User {
  role: string;
}

export function verifyAdmin(email: string): boolean {
  try {
    const stmt = db.prepare('SELECT role FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;
    
    if (!user) {
      return false;
    }

    return user.role === 'admin';
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
} 