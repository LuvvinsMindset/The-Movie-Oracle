import { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Chip, Divider, Tab, Tabs } from '@mui/material';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface Activity {
  id: number;
  type: string;
  description: string;
  user_email: string;
  created_at: string;
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { user, role } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/');
      return;
    }
    if (user) {
      fetchActivities();
      const interval = setInterval(fetchActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [role, user]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/admin/activities', {
        headers: {
          'user-email': user
        }
      });
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <PersonAddIcon color="primary" />;
      case 'message':
        return <MessageIcon color="info" />;
      case 'favorite':
        return <FavoriteIcon color="error" />;
      case 'role_change':
        return <AdminPanelSettingsIcon color="secondary" />;
      default:
        return <MessageIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'primary';
      case 'message':
        return 'info';
      case 'favorite':
        return 'error';
      case 'role_change':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filterActivities = (activities: Activity[]) => {
    switch (activeTab) {
      case 0: // All
        return activities;
      case 1: // Users
        return activities.filter(a => ['registration', 'role_change'].includes(a.type));
      case 2: // Messages
        return activities.filter(a => a.type === 'message');
      case 3: // Favorites
        return activities.filter(a => a.type === 'favorite');
      default:
        return activities;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          System Activity
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="activity tabs"
          >
            <Tab label="All Activities" />
            <Tab label="User Activities" />
            <Tab label="Messages" />
            <Tab label="Favorites" />
          </Tabs>
        </Box>

        <Paper elevation={3}>
          <List>
            {filterActivities(activities).map((activity, index) => (
              <Box key={activity.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemIcon>
                    {getActivityIcon(activity.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(activity.created_at)}
                        </Typography>
                        <Chip 
                          label={activity.type} 
                          size="small" 
                          color={getActivityColor(activity.type) as any}
                          sx={{ ml: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          by {activity.user_email}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ActivityPage; 