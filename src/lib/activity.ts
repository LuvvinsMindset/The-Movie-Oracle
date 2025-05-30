import db from './db';

export function logActivity(type: string, description: string, userEmail: string) {
  try {
    const stmt = db.prepare('INSERT INTO activities (type, description, user_email) VALUES (?, ?, ?)');
    stmt.run(type, description, userEmail);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
} 