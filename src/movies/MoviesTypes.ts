import { MediaType } from '@/common/CommonEnums';
import {
  DateString,
  ItemWithId,
  Maybe,
  PaginationResponse,
} from '@/common/CommonTypes';
import { BasePerson } from '@/people/PeopleTypes';

export interface Genre extends ItemWithId {
  name: string;
}

export interface Movie extends ItemWithId {
  title: string;
  overview: string;
  tagline: Maybe<string>;
  poster_path: string;
  backdrop_path: string;
  imdb_id: Maybe<string>;
  release_date: DateString;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  media_type: MediaType;
  runtime: number;
  adult: boolean;
  popularity: number;
}

export interface MovieImage {
  file_path: string;
}

export interface MovieVideo extends ItemWithId {
  key: string;
  name: string;
  type: string;
}

export type MovieCast = BasePerson & {
  character: string;
};

type MovieCrew = BasePerson & {
  job: string;
};

export type MovieDetails = Movie & {
  images: { backdrops: MovieImage[]; posters: MovieImage[] };
  videos: { results: MovieVideo[] };
  credits: { cast: MovieCast[]; crew: MovieCrew[] };
  recommendations: PaginationResponse<Movie>;
  budget: number;
  revenue: number;
};

export interface WatchProviderSource {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderCountry {
  link: string;
  rent?: WatchProviderSource[];
  buy?: WatchProviderSource[];
  flatrate?: WatchProviderSource[];
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: WatchProviderCountry;
  };
}
