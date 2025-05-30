import { useRouter } from 'next/router';
import BaseSeo from '@/seo/BaseSeo';
import { dehydrate, useQuery } from '@tanstack/react-query';
import { createQueryClient } from '@/http-client/queryClient';
import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import PersonProfile from '@/people-profile/PersonProfile';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { peopleAPI } from '@/people/peopleAPI';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function getPersonId(query: ParsedUrlQuery) {
  return Number(query.personId);
}

function PersonProfilePage() {
  const router = useRouter();
  const personId = getPersonId(router.query);
  const { data: person, isLoading } = useQuery(
    peopleAPI.personDetails(personId),
  );
  const [favorite, setFavorite] = useState(false);
  const { getImageUrl } = useApiConfiguration();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail && person) {
        try {
          const response = await axios.get(`/api/favorite-actors?email=${userEmail}`);
          const favorites = response.data.favorites;
          const isFavorite = favorites.some((actor: { actor_id: number }) => actor.actor_id === person.id);
          setFavorite(isFavorite);
        } catch (error) {
          console.error('Failed to fetch favorite status:', error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [person]);

  const handleFavorite = async () => {
    if (person) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          if (favorite) {
            await axios.delete('/api/favorite-actors', {
              data: {
                email: userEmail,
                actorId: person.id
              }
            });
            setFavorite(false);
          } else {
            await axios.post('/api/favorite-actors', {
              email: userEmail,
              actorId: person.id,
              actorName: person.name,
              profilePath: person.profile_path
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

  return (
    <>
      {person && (
        <>
        <BaseSeo
          title={person.name}
          description={person.biography || undefined}
          openGraph={{
            images: [
              {
                url: getImageUrl(person.profile_path),
                width: 500,
                height: 750,
              },
            ],
          }}
        />
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
      <PersonProfile person={person} loading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                onClick={handleFavorite} 
                variant="contained" 
                color={favorite ? "secondary" : "primary"} 
                fullWidth
                startIcon={favorite ? <DeleteIcon /> : undefined}
              >
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const personId = getPersonId(ctx.params ?? {});
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchQuery(peopleAPI.personDetails(personId)),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default PersonProfilePage;
