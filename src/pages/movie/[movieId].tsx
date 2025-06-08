import { useRouter } from 'next/router';
import BaseSeo from '@/seo/BaseSeo';
import MovieProfile from '@/movies-profile/MovieProfile';
import { dehydrate, useQuery, UseQueryResult } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import { moviesAPI } from '@/movies/moviesAPI';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import { Button, Grid, Typography, Box, Link, Divider, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { WatchProvidersResponse, WatchProviderSource } from '@/movies/MoviesTypes';
import { useTranslation } from '@/translations/useTranslation';

const COUNTRY_NAMES: { [key: string]: string } = {
  AE: 'United Arab Emirates',
  AR: 'Argentina',
  AT: 'Austria',
  AU: 'Australia',
  BE: 'Belgium',
  BG: 'Bulgaria',
  BR: 'Brazil',
  CA: 'Canada',
  CH: 'Switzerland',
  CL: 'Chile',
  CN: 'China',
  CO: 'Colombia',
  CZ: 'Czech Republic',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  ES: 'Spain',
  FI: 'Finland',
  FR: 'France',
  GB: 'United Kingdom',
  GR: 'Greece',
  HK: 'Hong Kong',
  HR: 'Croatia',
  HU: 'Hungary',
  ID: 'Indonesia',
  IE: 'Ireland',
  IN: 'India',
  IT: 'Italy',
  JP: 'Japan',
  KR: 'South Korea',
  LT: 'Lithuania',
  LV: 'Latvia',
  MX: 'Mexico',
  MY: 'Malaysia',
  NL: 'Netherlands',
  NO: 'Norway',
  NZ: 'New Zealand',
  PE: 'Peru',
  PH: 'Philippines',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  RU: 'Russia',
  SE: 'Sweden',
  SG: 'Singapore',
  TH: 'Thailand',
  TR: 'Turkey',
  TW: 'Taiwan',
  US: 'United States',
  VN: 'Vietnam',
  ZA: 'South Africa'
};

function getMovieId(query: ParsedUrlQuery) {
  return Number(query.movieId);
}

function MovieProfilePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const movieId = getMovieId(router.query);
  const { data, isLoading } = useQuery(moviesAPI.movieDetails(movieId));
  const watchProvidersQuery = useQuery(moviesAPI.movieWatchProviders(movieId)) as UseQueryResult<WatchProvidersResponse>;
  const { data: watchProviders } = watchProvidersQuery;
  const { getImageUrl } = useApiConfiguration();
  const [favorite, setFavorite] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState('LV');
  const countryProviders = watchProviders?.results?.[selectedCountry];

  const availableCountries = watchProviders?.results 
    ? Object.keys(watchProviders.results)
      .filter(code => COUNTRY_NAMES[code])
      .sort((a, b) => COUNTRY_NAMES[a].localeCompare(COUNTRY_NAMES[b]))
    : [];

  const handleCountryChange = (event: SelectChangeEvent) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail && data) {
        try {
          const response = await axios.get(`/api/favorites?email=${userEmail}`);
          const favorites = response.data.favorites;
          const isFavorite = favorites.some((movie: { movie_id: number }) => movie.movie_id === data.id);
          setFavorite(isFavorite);
        } catch (error) {
          console.error('Failed to fetch favorite status:', error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [data]);

  const handleFavorite = async () => {
    if (data) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          if (favorite) {
            await axios.delete('/api/favorites', {
              data: {
                email: userEmail,
                movieId: data.id
              }
            });
            setFavorite(false);
          } else {
            await axios.post('/api/favorites', {
              email: userEmail,
              movieId: data.id,
              movieTitle: data.title,
            });
            setFavorite(true);
          }
        } catch (error) {
          console.error('Failed to update favorite status:', error);
        }
      } else {
        router.push('/login');
      }
    }
  };

  const renderProviderSection = (title: string, providers: WatchProviderSource[] | undefined) => {
    if (!providers?.length) return null;
    
    return (
      <Box mt={2}>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {providers.map((provider: WatchProviderSource) => (
            <img
              key={provider.provider_id}
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
              title={provider.provider_name}
              style={{ width: 50, height: 50, borderRadius: '8px' }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      {data && (
        <>
          <BaseSeo
            title={data.title}
            description={data.overview}
            openGraph={{
              images: [
                {
                  url: getImageUrl(data.poster_path),
                  width: 500,
                  height: 750,
                  alt: data.title,
                },
              ],
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <MovieProfile movie={data} loading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                onClick={handleFavorite} 
                variant="contained" 
                color={favorite ? "secondary" : "primary"} 
                fullWidth
                startIcon={favorite ? <DeleteIcon /> : undefined}
              >
                {favorite ? t('removeFromFavorites') : t('addToFavorites')}
              </Button>

              {watchProviders?.results && Object.keys(watchProviders.results).length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    {t('whereToWatch')}
                  </Typography>
                  
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="country-select-label">{t('region')}</InputLabel>
                    <Select
                      labelId="country-select-label"
                      value={selectedCountry}
                      label={t('region')}
                      onChange={handleCountryChange}
                    >
                      {availableCountries.map((code) => (
                        <MenuItem key={code} value={code}>
                          {COUNTRY_NAMES[code]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {countryProviders ? (
                    <>
                      {renderProviderSection(String(t('stream')), countryProviders.flatrate)}
                      {renderProviderSection(String(t('rent')), countryProviders.rent)}
                      {renderProviderSection(String(t('buy')), countryProviders.buy)}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('noStreamingInfo')}
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const movieId = getMovieId(ctx.params ?? {});
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchQuery(moviesAPI.movieDetails(movieId)),
    queryClient.fetchQuery(moviesAPI.movieWatchProviders(movieId)),
    queryClient.fetchInfiniteQuery(moviesAPI.movieRecommendations(movieId)),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default MovieProfilePage;
