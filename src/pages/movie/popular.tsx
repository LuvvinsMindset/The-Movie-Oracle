import { dehydrate } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import MoviesListTemplate from '@/page-templates/MoviesListTemplate';
import { moviesAPI } from '@/movies/moviesAPI';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { GetServerSideProps } from 'next';

function PopularMoviesPage() {
  return (
    <MoviesListTemplate
      title="Popular Movies"
      description="Popular movies list"
      apiQuery={moviesAPI.popularMovies()}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchInfiniteQuery(moviesAPI.popularMovies()),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default PopularMoviesPage;
