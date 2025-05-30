import db from '../../../lib/db';
import { logActivity } from '@/lib/activity';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, role } = req.body;
  const adminEmail = req.headers['user-email'];

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updateStmt = db.prepare('UPDATE users SET role = ? WHERE email = ?');
    const result = updateStmt.run(role, email);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the role change activity
    await logActivity(
      'role_change',
      `User role changed to ${role} for ${email}`,
      adminEmail
    );

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
