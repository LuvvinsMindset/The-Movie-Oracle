import { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, IconButton } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon for the delete button

interface User {
  id: number;
  email: string;
  role: string;
}

interface Movie {
  id: number;
  movie_id: number;
  movie_title: string;
}

const Settings = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [roleEmail, setRoleEmail] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    const userRole = localStorage.getItem('userRole') || '';
    if (!userEmail) {
      router.push('/login');
    } else {
      setEmail(userEmail);
      setRole(userRole);
      fetchUserData(userEmail);
      fetchFavoriteMovies(userEmail);
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
    }
  };

  const fetchFavoriteMovies = async (email: string) => {
    try {
      const response = await axios.get(`/api/favorites?email=${email}`);
      setFavoriteMovies(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      const users = response.data.users as User[];
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      setError('New password cannot be empty');
      return;
    }

    try {
      await axios.post('/api/user/change-password', { email, password, newPassword });
      setSuccess('Password changed successfully');
      setError('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await axios.post('/api/admin/update-role', { email: roleEmail, role: newRole });
      setSuccess('User role updated successfully');
      setError('');
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userEmail: string) => {
    try {
      await axios.post('/api/admin/delete-user', { email: userEmail });
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleDeleteFavoriteMovie = async (movieId: number) => {
    try {
      await axios.delete('/api/favorites', { data: { email, movieId } });
      fetchFavoriteMovies(email); // Refresh the favorite movies list
    } catch (error) {
      console.error('Error deleting favorite movie:', error);
      setError('Failed to delete favorite movie');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4">Settings</Typography>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">Favorite Movies</Typography>
          <Box>
            {favoriteMovies.length ? (
              favoriteMovies.map((movie: Movie) => (
                <Box key={movie.id} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                  <Typography sx={{ flex: 1 }}>{movie.movie_title}</Typography>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteFavoriteMovie(movie.movie_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography>No favorite movies added</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">Security</Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Current Password"
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
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Change Password
            </Button>
          </Box>
        </Box>

        {role === 'admin' && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5">Admin Controls</Typography>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdateRole(); }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="roleEmail"
                label="User Email"
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
                label="New Role (user/admin)"
                type="text"
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Update Role
              </Button>
            </Box>

            {allUsers.length ? (
              allUsers.map((user: User) => (
                <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                  <Typography>{user.email}</Typography>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.email)}>
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No users found</Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Settings;
