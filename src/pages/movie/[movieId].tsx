import { useRouter } from 'next/router';
import BaseSeo from '@/seo/BaseSeo';
import MovieProfile from '@/movies-profile/MovieProfile';
import { dehydrate, useQuery } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import { moviesAPI } from '@/movies/moviesAPI';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import { Button, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function getMovieId(query: ParsedUrlQuery) {
  return Number(query.movieId);
}

function MovieProfilePage() {
  const router = useRouter();
  const movieId = getMovieId(router.query);
  const { data, isLoading } = useQuery(moviesAPI.movieDetails(movieId));
  const { getImageUrl } = useApiConfiguration();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail && data) {
        try {
          const response = await axios.get(`/api/favorites?email=${userEmail}`);
          const favorites = response.data.favorites;
          const isFavorite = favorites.some((movie: { movie_id: number }) => movie.movie_id === data.id);
          setFavorite(isFavorite);
        } catch (error) {
          console.error('Failed to fetch favorite status:', error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [data]);

  const handleFavorite = async () => {
    if (data) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          await axios.post('/api/favorites', {
            email: userEmail,
            movieId: data.id,
            movieTitle: data.title,
          });
          setFavorite(true);
        } catch (error) {
          console.error('Failed to add favorite movie:', error);
        }
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <>
      {data && (
        <>
          <BaseSeo
            title={data.title}
            description={data.overview}
            openGraph={{
              images: [
                {
                  url: getImageUrl(data.poster_path),
                  width: 500,
                  height: 750,
                  alt: data.title,
                },
              ],
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <MovieProfile movie={data} loading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button onClick={handleFavorite} variant="contained" color="primary" fullWidth>
                {favorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const movieId = getMovieId(ctx.params ?? {});
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchQuery(moviesAPI.movieDetails(movieId)),
    queryClient.fetchInfiniteQuery(moviesAPI.movieRecommendations(movieId)),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default MovieProfilePage;
