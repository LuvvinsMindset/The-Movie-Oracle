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
import { Button } from '@mui/material';
import { useState } from 'react';
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

  const handleFavorite = async () => {
    if (data) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          await axios.post('/api/favorites', {
            email: userEmail,
            movieId: data.id,
            title: data.title,
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
          <MovieProfile movie={data} loading={isLoading} />
          <Button onClick={handleFavorite} variant="contained" color="primary">
            {favorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
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
