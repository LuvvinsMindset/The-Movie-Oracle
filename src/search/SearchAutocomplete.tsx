import { useMemo, useState } from 'react';
import BaseAutocomplete from '@/common/BaseAutocomplete';
import { useRouter } from 'next/router';
import { Maybe } from '@/common/CommonTypes';
import { getAllPageResults } from '@/common/CommonUtils';
import { Suggestion } from './SearchTypes';
import MovieAutocompleteItem from './MovieAutocompleteItem';
import PersonAutocompleteItem from './PersonAutocompleteItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isMovie } from '@/movies/MoviesUtils';
import { MediaType } from '@/common/CommonEnums';
import { isPerson } from '@/people/PeopleUtils';
import { searchAPI } from './searchAPI';
import { SxProps, Theme } from '@mui/material';
import { useDebounce, useHasChanged } from '@/common/CommonHooks';
import { useTranslation } from '@/translations/useTranslation';

interface SearchAutocompleteProps {
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
}

function SearchAutocomplete({ autoFocus, sx }: SearchAutocompleteProps) {
  const router = useRouter();
  const { searchQuery } = router.query;
  const queryValue = typeof searchQuery === 'string' ? searchQuery : '';
  const [searchValue, setSearchValue] = useState(queryValue);
  if (useHasChanged(queryValue)) {
    setSearchValue(queryValue);
  }

  const debouncedSearchValue = useDebounce(searchValue);
  const isSearchEnabled = !!debouncedSearchValue;
  const { data, isFetching } = useInfiniteQuery({
    ...searchAPI.searchMulti(debouncedSearchValue),
    enabled: isSearchEnabled,
  });

  const { t } = useTranslation();

  const handleRedirect = (inputValue: string) => {
    if (inputValue) {
      router.push({
        pathname: '/search',
        query: { searchQuery: inputValue },
      });
    }
  };

  const handleSelect = (selectedOption: Maybe<Suggestion>) => {
    if (selectedOption) {
      switch (selectedOption.media_type) {
        case MediaType.MOVIE:
          router.push(`/movie/${selectedOption.id}`);
          break;
        case MediaType.PERSON:
          router.push(`/person/${selectedOption.id}`);
          break;
        default:
          return;
      }
    }
  };

  const options = useMemo<Suggestion[]>(
    () =>
      getAllPageResults(data).filter(
        (option) => isMovie(option) || isPerson(option),
      ),
    [data],
  );

  return (
    <BaseAutocomplete<Suggestion, false, true, true>
      sx={sx}
      placeholder={t('search')}
      options={options}
      renderOption={(props, option) => {
        return isMovie(option) ? (
          <MovieAutocompleteItem
            {...props}
            key={`${option.media_type}_${option.id}`}
            movie={option}
          />
        ) : (
          <PersonAutocompleteItem
            {...props}
            key={`${option.media_type}_${option.id}`}
            person={option}
          />
        );
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return isMovie(option) ? option.title : option.name;
      }}
      loading={isFetching}
      inputValue={searchValue ?? ''}
      onInputChange={(e, newInputValue) => setSearchValue(newInputValue)}
      freeSolo
      autoFocus={autoFocus}
      value=""
      onChange={(e, newValue) => {
        if (typeof newValue === 'string') {
          handleRedirect(newValue);
        } else if (!Array.isArray(newValue)) {
          handleSelect(newValue);
        }
      }}
      onSearchClick={handleRedirect}
    />
  );
}

export default SearchAutocomplete;
