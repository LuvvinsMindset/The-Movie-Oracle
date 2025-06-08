import { Box, MenuItem, TextField } from '@mui/material';
import { Maybe } from '@/common/CommonTypes';
import { useTranslation } from '@/translations/useTranslation';

const MOVIE_SORTING = {
  popularity: {
    id: 'popularity.desc',
    titleKey: 'popularity'
  },
  rating: {
    id: 'vote_average.desc',
    titleKey: 'rating'
  },
  releaseDate: {
    id: 'release_date.desc',
    titleKey: 'releaseDate'
  },
  title: {
    id: 'release_date.asc',
    titleKey: 'oldestMovies'
  }
};

const sortings = Object.values(MOVIE_SORTING);

export function getSelectedSorting(sortBy: Maybe<string | string[]>) {
  const defaultSorting = MOVIE_SORTING.popularity;

  if (typeof sortBy !== 'string') {
    return defaultSorting;
  }

  const selectedSorting =
    sortings.find((sorting) => sorting.id === sortBy) ?? defaultSorting;

  return selectedSorting;
}

interface MovieSortingSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function MovieSortingSelect({ value, onChange }: MovieSortingSelectProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ minWidth: 220 }}>
      <TextField
        label={t('sortBy')}
        select
        fullWidth
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {sortings.map((option) => {
          return (
            <MenuItem key={option.id} value={option.id}>
              {t(option.titleKey)}
            </MenuItem>
          );
        })}
      </TextField>
    </Box>
  );
}

export default MovieSortingSelect;
