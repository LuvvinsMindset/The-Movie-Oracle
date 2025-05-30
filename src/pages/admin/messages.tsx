import { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import { messageEvents } from '@/utils/messageEvents';
import Notification from '@/components/Notification';

interface SupportMessage {
  id: number;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const { user, role } = useUser();
  const router = useRouter();
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/');
      return;
    }
    if (user) {
      fetchMessages();
      
      // Poll for new messages every 5 seconds
      const pollInterval = setInterval(checkNewMessages, 5000);
      
      // Subscribe to message events
      const unsubscribe = messageEvents.subscribe((event) => {
        if (event.type === 'new') {
          fetchMessages(); // Immediately fetch messages when a new one is sent
        }
      });

      return () => {
        clearInterval(pollInterval);
        unsubscribe();
      };
    }
  }, [role, user]);

  const checkNewMessages = async () => {
    try {
      const response = await axios.get('/api/admin/messages', {
        headers: {
          'user-email': user
        }
      });
      const newMessages = response.data.messages;
      
      // Check if there are any new pending messages
      const pendingCount = newMessages.filter((msg: SupportMessage) => msg.status === 'pending').length;
      
      if (pendingCount > lastMessageCountRef.current) {
        // New messages detected
        setMessages(newMessages);
        messageEvents.emit({ 
          type: 'new',
          count: pendingCount - lastMessageCountRef.current
        });
        playNotificationSound();
      }
      
      lastMessageCountRef.current = pendingCount;
    } catch (error) {
      console.error('Error checking new messages:', error);
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Error playing sound:', e));
    } catch (error) {
      console.error('Error with notification sound:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/admin/messages', {
        headers: {
          'user-email': user
        }
      });
      const newMessages = response.data.messages;
      setMessages(newMessages);
      
      // Update the last message count
      const pendingCount = newMessages.filter((msg: SupportMessage) => msg.status === 'pending').length;
      lastMessageCountRef.current = pendingCount;
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.post('/api/admin/messages/update-status', {
        id,
        status: 'read'
      }, {
        headers: {
          'user-email': user
        }
      });
      await fetchMessages();
      messageEvents.emit({ type: 'read' });
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete('/api/admin/messages/delete', {
        data: { id },
        headers: {
          'user-email': user
        }
      });
      await fetchMessages();
      messageEvents.emit({ type: 'delete' });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Notification />
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Support Messages
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow 
                  key={message.id}
                  hover
                  onClick={() => setSelectedMessage(message)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Chip 
                      label={message.status}
                      color={message.status === 'pending' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(message.created_at)}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id);
                      }}
                      disabled={message.status === 'read'}
                    >
                      <MarkEmailReadIcon />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={!!selectedMessage} 
          onClose={() => setSelectedMessage(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedMessage && (
            <>
              <DialogTitle>
                {selectedMessage.subject}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  From: {selectedMessage.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sent: {formatDate(selectedMessage.created_at)}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  {selectedMessage.message}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedMessage(null)}>Close</Button>
                {selectedMessage.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    color="primary"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    handleDelete(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  color="error"
                >
                  Delete
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default Messages; 