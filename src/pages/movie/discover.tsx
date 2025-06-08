import MoviesListTemplate from '@/page-templates/MoviesListTemplate';
import { useRouter } from 'next/router';
import { dehydrate, useQuery } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import MovieSortingSelect, {
  getSelectedSorting,
} from '@/movies/MovieSortingSelect';
import { moviesAPI } from '@/movies/moviesAPI';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import { useTranslation } from '@/translations/useTranslation';

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

function getFilterValues(query: ParsedUrlQuery) {
  const sorting = getSelectedSorting(query.sortBy);
  const genreId = Number(query.genreId) || undefined;
  return { sorting, genreId };
}

function DiscoverMoviesPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: genres } = useQuery(moviesAPI.genres());
  const { genreId, sorting } = getFilterValues(router.query);
  const genre = genres?.find((genre) => genre.id === genreId);
  const genreTranslationKey = genre ? genreTranslationMap[genre.id] : undefined;
  const genreName = genreTranslationKey ? t(genreTranslationKey) : genre?.name;

  return (
    <MoviesListTemplate
      title={genreName ? `${genreName} ${t('movies')}` : t('discoverMovies')}
      titleExtra={
        <MovieSortingSelect
          value={sorting.id}
          onChange={(sortBy) =>
            router.push({ query: { ...router.query, sortBy } }, undefined, {
              shallow: true,
            })
          }
        />
      }
      description={genreName ? `${genreName} ${t('movies')}` : t('discoverMovies')}
      apiQuery={moviesAPI.discoverMovies({
        genreId,
        sortBy: sorting.id,
      })}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { genreId, sorting } = getFilterValues(ctx.query);
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchQuery(moviesAPI.genres()),
    queryClient.fetchInfiniteQuery(
      moviesAPI.discoverMovies({
        genreId,
        sortBy: sorting.id,
      }),
    ),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default DiscoverMoviesPage;
