import { MediaType } from '@/common/CommonEnums';
import { DateString, ItemWithId, Maybe } from '@/common/CommonTypes';
import { Movie, MovieImage } from '@/movies/MoviesTypes';

export interface BasePerson extends ItemWithId {
  name: string;
  profile_path: string;
  gender: number;
  adult: boolean;
  popularity: number;
}

export interface Person extends BasePerson {
  biography: Maybe<string>;
  known_for_department: string;
  birthday: DateString;
  place_of_birth: string;
  official_site: Maybe<string>;
  also_known_as: Maybe<string[]>;
  imdb_id: Maybe<string>;
  media_type: MediaType;
}

export type PersonImage = MovieImage;

export type PersonCasting = Movie & { character: string };

type PersonCrew = Movie & { job: string };

export type PersonCredits = { cast: PersonCasting[]; crew: PersonCrew[] };

export type PersonDetails = {
  person: Person;
  personImages: { profiles: PersonImage[] };
  personCredits: PersonCredits;
};
