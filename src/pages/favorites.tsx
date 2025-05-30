import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardMedia, CardContent, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface FavoriteMovie {
  movie_id: number;
  movie_title: string;
  poster_path?: string;
}

interface FavoriteActor {
  actor_id: number;
  actor_name: string;
  profile_path?: string;
}

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovie[]>([]);
  const [favoriteActors, setFavoriteActors] = useState<FavoriteActor[]>([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const [moviesResponse, actorsResponse] = await Promise.all([
        axios.get(`/api/favorites?email=${user}`),
        axios.get(`/api/favorite-actors?email=${user}`)
      ]);
      setFavoriteMovies(moviesResponse.data.favorites);
      setFavoriteActors(actorsResponse.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleDeleteMovie = async (movieId: number) => {
    try {
      await axios.delete('/api/favorites', { data: { email: user, movieId } });
      setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie.movie_id !== movieId));
    } catch (error) {
      console.error('Error deleting favorite movie:', error);
    }
  };

  const handleDeleteActor = async (actorId: number) => {
    try {
      await axios.delete('/api/favorite-actors', { data: { email: user, actorId } });
      setFavoriteActors(prevActors => prevActors.filter(actor => actor.actor_id !== actorId));
    } catch (error) {
      console.error('Error deleting favorite actor:', error);
    }
  };

  const getImageUrl = (path: string | undefined, type: 'movie' | 'person') => {
    if (!path) return '/placeholder-image.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Movies
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {favoriteMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={3} key={movie.movie_id}>
            <Card>
              <Link href={`/movie/${movie.movie_id}`} passHref>
                <CardMedia
                      component="img"
                  height="300"
                  image={getImageUrl(movie.poster_path, 'movie')}
                      alt={movie.movie_title}
                  sx={{ cursor: 'pointer' }}
                    />
              </Link>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" noWrap sx={{ flex: 1 }}>
                      {movie.movie_title}
                    </Typography>
                <IconButton onClick={() => handleDeleteMovie(movie.movie_id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        Favorite Actors
      </Typography>
      <Grid container spacing={3}>
        {favoriteActors.map((actor) => (
          <Grid item xs={12} sm={6} md={3} key={actor.actor_id}>
            <Card>
              <Link href={`/person/${actor.actor_id}`} passHref>
                <CardMedia
                  component="img"
                  height="300"
                  image={getImageUrl(actor.profile_path, 'person')}
                  alt={actor.actor_name}
                  sx={{ cursor: 'pointer' }}
                />
                </Link>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" noWrap sx={{ flex: 1 }}>
                  {actor.actor_name}
                </Typography>
                <IconButton onClick={() => handleDeleteActor(actor.actor_id)} size="small">
                    <DeleteIcon />
                  </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites; 