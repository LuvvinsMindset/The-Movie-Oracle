import { forwardRef, useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Stack, Button, Badge, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HideOnScroll from '@/layout/HideOnScroll';
import SearchAutocomplete from '@/search/SearchAutocomplete';
import AppTitle from './AppTitle';
import { usePaletteMode } from '@/theme/BaseThemeProvider';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import Brightness5OutlinedIcon from '@mui/icons-material/Brightness5Outlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExternalLink from '@/routing/ExternalLink';
import { useIsMobile } from '@/common/CommonHooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmailIcon from '@mui/icons-material/Email';
import TimelineIcon from '@mui/icons-material/Timeline';
import axios from 'axios';
import { messageEvents } from '@/utils/messageEvents';
import { useTranslation } from '@/translations/useTranslation';

const AppHeader = forwardRef<HTMLDivElement>(function AppHeader(props, ref) {
  const isMobile = useIsMobile();
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const { user, logout, username, role } = useUser();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (role === 'admin') {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      
      const unsubscribe = messageEvents.subscribe((event) => {
        if (['new', 'read', 'delete'].includes(event.type)) {
          fetchUnreadCount();
        }
      });
      
      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }
  }, [role]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/admin/messages/unread-count', {
        headers: {
          'user-email': user
        }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if (!isMobile && isMobileSearch) {
    setIsMobileSearch(false);
  }

  function showMobileSearch() {
    setIsMobileSearch(true);
  }

  function hideMobileSearch() {
    setIsMobileSearch(false);
  }

  const { mode, toggleMode } = usePaletteMode();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <HideOnScroll>
      <AppBar
        ref={ref}
        color="default"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {!isMobileSearch && <AppTitle />}

          <Box sx={{ display: { xs: 'flex', md: 'none', flex: 1 } }}>
            {isMobileSearch && (
              <>
                <IconButton
                  aria-label="Hide search"
                  sx={{ marginRight: 2 }}
                  onClick={hideMobileSearch}
                >
                  <CloseIcon />
                </IconButton>
                <SearchAutocomplete autoFocus />
              </>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flex: 1,
              mx: 2,
              justifyContent: 'center',
            }}
          >
            <SearchAutocomplete sx={{ maxWidth: 680 }} />
          </Box>

          {!isMobileSearch && (
            <Stack spacing={1} direction="row">
              <IconButton
                aria-label={t('search')}
                onClick={showMobileSearch}
                sx={{ display: { md: 'none' } }}
              >
                <SearchIcon />
              </IconButton>

              {user && (
                <IconButton
                  color="inherit"
                  onClick={() => router.push('/support')}
                  sx={{ ml: 1 }}
                  aria-label={t('support')}
                >
                  <HelpOutlineIcon />
                </IconButton>
              )}

              {role === 'admin' && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={() => router.push('/admin/messages')}
                    sx={{ ml: 1 }}
                    aria-label={t('messages')}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <EmailIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={() => router.push('/admin/activity')}
                    sx={{ ml: 1 }}
                    aria-label={t('activity')}
                  >
                    <TimelineIcon />
                  </IconButton>
                </>
              )}

              <IconButton aria-label="Toggle theme" onClick={toggleMode}>
                {mode === 'light' ? <DarkModeIcon /> : <Brightness5OutlinedIcon />}
              </IconButton>

              <IconButton
                aria-label="GitHub"
                href="https://github.com/LuvvinsMindset/The-Movie-Oracle"
                LinkComponent={ExternalLink}
              >
                <GitHubIcon />
              </IconButton>

              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/settings" passHref>
                      <Button color="inherit">{username}</Button>
                    </Link>
                    <Link href="/favorites" passHref>
                      <IconButton sx={{ color: 'white' }} aria-label={t('favorites')}>
                        <FavoriteIcon />
                      </IconButton>
                    </Link>
                    <Button onClick={handleLogout} color="inherit">
                      {t('logout')}
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Link href="/login" passHref>
                    <Button variant="contained" color="primary">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button variant="contained" color="secondary">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
});

export default AppHeader;
