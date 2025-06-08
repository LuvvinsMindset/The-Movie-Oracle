import {
  Divider,
  Drawer,
  List,
  ListSubheader,
  styled,
  Toolbar,
  Box,
} from '@mui/material';
import AppDrawerItem from './AppDrawerItem';
import { useAppDrawer } from './AppDrawerContext';
import PersonIcon from '@mui/icons-material/RecentActors';
import StarIcon from '@mui/icons-material/StarRate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useQuery } from '@tanstack/react-query';
import AppTitle from './AppTitle';
import { moviesAPI } from '@/movies/moviesAPI';
import { useRouter } from 'next/router';
import TmdbAttribution from './TmdbAttribution';
import LoadingIndicator from '@/common/LoadingIndicator';
import { useTranslation } from '@/translations/useTranslation';

export const APP_DRAWER_WIDTH = 260;

const StyledDrawer = styled(Drawer)({
  '.MuiDrawer-paper': {
    width: APP_DRAWER_WIDTH,
    overflow: 'hidden',
  },
});

const genreTranslationMap: { [key: number]: string } = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'scienceFiction',
  10770: 'tvMovie',
  53: 'thriller',
  10752: 'war',
  37: 'western'
};

function AppDrawer() {
  const { isOpen, close } = useAppDrawer();
  const router = useRouter();
  const { data: genres, isLoading } = useQuery(moviesAPI.genres());
  const { t } = useTranslation();

  const drawerContent = (
    <>
      <Toolbar>
        <AppTitle />
      </Toolbar>
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <List subheader={<ListSubheader>{t('discover')}</ListSubheader>}>
          <AppDrawerItem
            href="/movie/popular"
            selected={router.pathname === '/movie/popular'}
            icon={<TrendingUpIcon />}
            title={t('popularMovies')}
          />
          <AppDrawerItem
            href="/movie/top-rated"
            selected={router.pathname === '/movie/top-rated'}
            icon={<StarIcon />}
            title={t('topRatedMovies')}
          />
          <AppDrawerItem
            href="/person/popular"
            selected={router.pathname === '/person/popular'}
            icon={<PersonIcon />}
            title={t('popularPeople')}
          />
        </List>
        <Divider />
        <LoadingIndicator loading={isLoading}>
          <List subheader={<ListSubheader>{t('movieGenres')}</ListSubheader>}>
            {genres?.map((genre) => {
              const translationKey = genreTranslationMap[genre.id];
              return (
                <AppDrawerItem
                  key={genre.id}
                  href={{
                    pathname: '/movie/discover',
                    query: { genreId: genre.id },
                  }}
                  title={translationKey ? t(translationKey) : genre.name}
                  selected={
                    router.pathname === '/movie/discover' &&
                    Number(router.query.genreId) === genre.id
                  }
                />
              );
            })}
          </List>
        </LoadingIndicator>
      </Box>
      <TmdbAttribution />
    </>
  );

  return (
    <>
      <StyledDrawer
        variant="temporary"
        open={isOpen}
        onClose={close}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {drawerContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
        open
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
}

export default AppDrawer;
