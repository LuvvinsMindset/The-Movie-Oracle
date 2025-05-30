import { Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { messageEvents } from '@/utils/messageEvents';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const showNotification = (event: { type: string; count?: number }) => {
      switch (event.type) {
        case 'new':
          setMessage(`${event.count} new message${event.count === 1 ? '' : 's'} received!`);
          setOpen(true);
          break;
        case 'read':
          setMessage('Message marked as read');
          setOpen(true);
          break;
        case 'delete':
          setMessage('Message deleted');
          setOpen(true);
          break;
      }
    };

    const unsubscribe = messageEvents.subscribe(showNotification);
    return () => unsubscribe();
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="info" 
        sx={{ width: '100%' }}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 