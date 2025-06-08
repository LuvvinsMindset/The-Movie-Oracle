import { dehydrate } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import MoviesListTemplate from '@/page-templates/MoviesListTemplate';
import { moviesAPI } from '@/movies/moviesAPI';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { GetServerSideProps } from 'next';
import { useTranslation } from '@/translations/useTranslation';

function TopRatedMoviesPage() {
  const { t } = useTranslation();

  return (
    <MoviesListTemplate
      title={t('topRatedMovies')}
      description={t('topRatedMovies')}
      apiQuery={moviesAPI.topRatedMovies()}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchInfiniteQuery(moviesAPI.topRatedMovies()),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default TopRatedMoviesPage;
