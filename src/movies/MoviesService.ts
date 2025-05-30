import { ID, PaginationResponse } from '@/common/CommonTypes';
import { CustomError } from '@/error-handling/CustomError';
import {
  filterViewablePageResults,
  filterViewablePeople,
  shouldViewMovie,
  VIEW_FILTER_LIMIT,
} from '@/view-filters/ViewFiltersUtils';
import { MovieDetails, Genre, Movie } from './MoviesTypes';
import queryString from 'query-string';
import { tmdbClient } from '@/http-client/tmdbClient';

const getMovie = async <T extends Movie>(
  movieId: ID,
  args: {
    appendToResponse?: string[];
    params?: queryString.StringifiableRecord;
  },
) => {
  const movie = await tmdbClient.get<T>(`/movie/${movieId}`, {
    ...args.params,
    append_to_response: args.appendToResponse?.join(),
  });
  if (!shouldViewMovie(movie)) {
    throw new CustomError(
      404,
      'The resource you requested could not be found.',
    );
  }
  return movie;
};

const getMovieGenres = async () => {
  const response = await tmdbClient.get<GenreResponse>('/genre/movie/list');
  return response.genres;
};

const getDiscoverMovies = async (
  page: number,
  params: { genreId?: ID; sortBy?: string },
): Promise<PaginationResponse<Movie>> => {
  const movies = await tmdbClient.get<PaginationResponse<Movie>>(
    '/discover/movie',
    {
      params: {
        with_genres: params.genreId,
        sort_by: params.sortBy,
        page,
        'vote_count.gte': VIEW_FILTER_LIMIT.minVoteCount,
      },
    },
  );

  return filterViewablePageResults(movies);
};

const getPopularMovies = async (page: number): Promise<PaginationResponse<Movie>> => {
  const movies = await tmdbClient.get<PaginationResponse<Movie>>(
    '/movie/popular',
    { params: { page } },
  );

  return filterViewablePageResults(movies);
};

const getTopRatedMovies = async (page: number): Promise<PaginationResponse<Movie>> => {
  const movies = await tmdbClient.get<PaginationResponse<Movie>>(
    '/movie/top_rated',
    { params: { page } },
  );

  return filterViewablePageResults(movies);
};

const getMovieDetails = async (movieId: ID): Promise<MovieDetails> => {
  const movie = await tmdbClient.get<MovieDetails>(`/movie/${movieId}`, {
    params: {
      append_to_response: 'images,videos,credits',
    },
  });

  return movie;
};

const getMovieRecommendations = async (
  movieId: ID,
  params: { page: number },
): Promise<PaginationResponse<Movie>> => {
  const movies = await tmdbClient.get<PaginationResponse<Movie>>(
    `/movie/${movieId}/recommendations`,
    { params },
  );

  return filterViewablePageResults(movies);
};

interface FindResponse {
  movie_results: Movie[];
}

interface GenreResponse {
  genres: { id: number; name: string; }[];
}

const getMovieByExternalId = async (externalId: string): Promise<MovieDetails | null> => {
  const response = await tmdbClient.get<FindResponse>(`/find/${externalId}`, {
    params: {
      external_source: 'imdb_id',
    },
  });

  const movie = response.movie_results[0];

  if (!movie) {
    return null;
  }

  const movieDetails = await getMovieDetails(movie.id);
  return movieDetails;
};

export const moviesService = {
  getMovie,
  getMovieGenres,
  getDiscoverMovies,
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetails,
  getMovieRecommendations,
  getMovieByExternalId,
};
