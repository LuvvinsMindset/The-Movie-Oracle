import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { messageEvents } from '@/utils/messageEvents';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('/api/support', {
        email: user,
        subject: subject.trim(),
        message: message.trim()
      });
      
      messageEvents.emit({ 
        type: 'new',
        count: 1
      });
      
      setSuccess('Your message has been sent successfully!');
      setError('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Contact Support
        </Typography>
        <Typography variant="body1" gutterBottom align="center" color="text.secondary">
          Have a question or found an issue? Let us know!
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="subject"
              label="Subject"
              name="subject"
              autoFocus
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label="Message"
              id="message"
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Support; 