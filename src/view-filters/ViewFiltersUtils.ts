import { PaginationResponse } from '@/common/CommonTypes';
import { Movie } from '@/movies/MoviesTypes';
import { isMovie } from '@/movies/MoviesUtils';
import { BasePerson } from '@/people/PeopleTypes';
import { isPerson } from '@/people/PeopleUtils';

export const VIEW_FILTER_LIMIT = {
  minVoteCount: 50,
  minPopularity: 5,
  oldMoviesMinVoteCount: 5,
  oldMoviesMinPopularity: 1
};

export function shouldViewMovie<T extends Movie>(movie: T) {
  const isOldMovie = movie.release_date && new Date(movie.release_date).getFullYear() < 2000;
  
  const minVoteCount = isOldMovie ? VIEW_FILTER_LIMIT.oldMoviesMinVoteCount : VIEW_FILTER_LIMIT.minVoteCount;
  const minPopularity = isOldMovie ? VIEW_FILTER_LIMIT.oldMoviesMinPopularity : VIEW_FILTER_LIMIT.minPopularity;

  return (
    !movie.adult &&
    movie.vote_count >= minVoteCount &&
    movie.popularity >= minPopularity
  );
}

export function filterViewableMovies<T extends Movie>(movies: T[]) {
  return movies.filter(shouldViewMovie);
}

export function shouldViewPerson<T extends BasePerson>(person: T) {
  return !person.adult && person.popularity >= VIEW_FILTER_LIMIT.minPopularity;
}

export function filterViewablePeople<T extends BasePerson>(people: T[]) {
  return people.filter(shouldViewPerson);
}

export function filterViewablePageResults<T>(
  page: PaginationResponse<T>,
): PaginationResponse<T> {
  const remainingItems = page.results.filter(
    (item) =>
      (isMovie(item) && shouldViewMovie(item)) ||
      (isPerson(item) && shouldViewPerson(item)),
  );
  const removedItemCount = page.results.length - remainingItems.length;
  return {
    ...page,
    results: remainingItems,
    total_results: page.total_results - removedItemCount,
    total_pages: !remainingItems.length ? page.page : page.total_pages,
  };
}
