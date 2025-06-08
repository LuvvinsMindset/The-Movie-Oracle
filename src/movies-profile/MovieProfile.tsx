import { Stack, Typography } from '@mui/material';
import MovieIntroduction from './MovieIntroduction';
import MovieImageCarousel from './MovieImageCarousel';
import MovieVideoCarousel from './MovieVideoCarousel';
import MovieCastCarousel from './MovieCastCarousel';
import MovieRecommendations from './MovieRecommendations';
import { Maybe } from '@/common/CommonTypes';
import LoadingIndicator from '@/common/LoadingIndicator';
import { MovieDetails } from '@/movies/MoviesTypes';
import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import FullSizeBackgroundImage from '@/common/FullSizeBackgroundImage';
import { useTranslation } from '@/translations/useTranslation';

interface MovieProfileProps {
  movie: Maybe<MovieDetails>;
  loading: boolean;
}

function MovieProfile({ movie, loading }: MovieProfileProps) {
  const { getImageUrl } = useApiConfiguration();
  const { t } = useTranslation();

  return (
    <LoadingIndicator loading={loading}>
      {movie && (
        <>
          <FullSizeBackgroundImage
            src={getImageUrl(movie.backdrop_path, { quality: 'original' })}
            alt={movie.title}
          />
          <Stack spacing={2}>
            <MovieIntroduction movie={movie} />

            <div>
              <Typography variant="h6" gutterBottom>
                {t('videos')}
              </Typography>
              <MovieVideoCarousel movieId={movie.id} />
            </div>

            <div>
              <Typography variant="h6" gutterBottom>
                {t('images')}
              </Typography>
              <MovieImageCarousel movie={movie} />
            </div>

            <div>
              <Typography variant="h6" gutterBottom>
                {t('movieCast')}
              </Typography>
              <MovieCastCarousel movieId={movie.id} />
            </div>

            <div>
              <Typography variant="h6" gutterBottom>
                {t('recommendations')}
              </Typography>
              <MovieRecommendations movieId={movie.id} />
            </div>
          </Stack>
        </>
      )}
    </LoadingIndicator>
  );
}

export default MovieProfile;
