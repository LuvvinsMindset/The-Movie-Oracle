import { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useTranslation } from '@/translations/useTranslation';

interface User {
  id: number;
  email: string;
  role: string;
}

const Settings = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [roleEmail, setRoleEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>('');
  const router = useRouter();
  const { login } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    const userRole = localStorage.getItem('userRole') || '';
    const storedUsername = localStorage.getItem('username') || '';
    if (!userEmail) {
      router.push('/login');
    } else {
      setEmail(userEmail);
      setUsername(storedUsername);
      setRole(userRole);
      fetchUserData(userEmail);
    }
  }, []);

  const fetchUserData = async (email: string) => {
    try {
      const response = await axios.get(`/api/user?email=${email}`);
      const data = response.data;
      setRole(data.role);
      if (data.role === 'admin') {
        fetchAllUsers();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(t('errorOccurred'));
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      const users = response.data.users as User[];
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError(t('errorOccurred'));
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      setError(t('newPassword'));
      return;
    }

    try {
      await axios.post('/api/user/change-password', { email, password, newPassword });
      setSuccess(t('passwordChanged'));
      setError('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError(t('passwordError'));
    }
  };

  const handleUpdateRole = async () => {
    try {
      await axios.post('/api/admin/update-role', { email: roleEmail, role: newRole });
      setSuccess(t('roleUpdated'));
      setError('');
      fetchAllUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(t('roleError'));
    }
  };

  const handleDeleteUser = async (userEmail: string) => {
    try {
      await axios.post('/api/admin/delete-user', { email: userEmail });
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(t('errorOccurred'));
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername || newUsername.length < 3) {
      setError(t('usernameError'));
      return;
    }

    try {
      await axios.post('/api/user/change-username', { email, newUsername });
      setSuccess(t('usernameChanged'));
      setError('');
      login(email, newUsername);
      setUsername(newUsername);
      setNewUsername('');
    } catch (error: any) {
      console.error('Error changing username:', error);
      setError(error.response?.data?.message || t('usernameError'));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4">{t('settings')}</Typography>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">{t('profile')}</Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleChangeUsername(); }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentUsername"
              label={t('currentUsername')}
              type="text"
              id="currentUsername"
              value={username}
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newUsername"
              label={t('newUsername')}
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {t('changeUsername')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">{t('security')}</Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('currentPassword')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label={t('newPassword')}
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {t('changePassword')}
            </Button>
          </Box>
        </Box>

        {role === 'admin' && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5">{t('adminControls')}</Typography>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdateRole(); }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="roleEmail"
                label={t('userEmail')}
                type="email"
                id="roleEmail"
                value={roleEmail}
                onChange={(e) => setRoleEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newRole"
                label={t('newRole')}
                type="text"
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {t('updateRole')}
              </Button>
            </Box>

            {allUsers.length ? (
              allUsers.map((user: User) => (
                <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                  <Typography>{user.email}</Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#ff0000',
                      '&:hover': {
                        bgcolor: '#cc0000'
                      }
                    }}
                    onClick={() => handleDeleteUser(user.email)}
                  >
                    {t('deleteUser')}
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>{t('noUsers')}</Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Settings;
