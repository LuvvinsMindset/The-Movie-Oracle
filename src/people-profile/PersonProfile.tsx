import { Stack, Typography } from '@mui/material';
import PersonIntroduction from './PersonIntroduction';
import PersonImageCarousel from './PersonImageCarousel';
import PersonCastingGridList from '@/people-profile/PersonCastingGridList';
import { Maybe } from '@/common/CommonTypes';
import LoadingIndicator from '@/common/LoadingIndicator';
import { Person } from '@/people/PeopleTypes';
import PersonCrewGridList from './PersonCrewGridList';
import FullSizeBackgroundImage from '@/common/FullSizeBackgroundImage';
import useApiConfiguration from '@/api-configuration/ApiConfigurationHooks';
import { useTranslation } from '@/translations/useTranslation';

interface PersonProfileProps {
  person: Maybe<Person>;
  loading: boolean;
}

function PersonProfile({ person, loading }: PersonProfileProps) {
  const { getImageUrl } = useApiConfiguration();
  const { t } = useTranslation();

  return (
    <LoadingIndicator loading={loading}>
      {person && (
        <>
          <FullSizeBackgroundImage
            src={getImageUrl(person.profile_path, { quality: 'original' })}
            alt={person.name}
          />
          <Stack spacing={2}>
            <PersonIntroduction person={person} />
            <div>
              <Typography variant="h6" gutterBottom>
                {t('images')}
              </Typography>
              <PersonImageCarousel person={person} />
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                {t('personCast')}
              </Typography>
              <PersonCastingGridList personId={person.id} />
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                {t('crew')}
              </Typography>
              <PersonCrewGridList personId={person.id} />
            </div>
          </Stack>
        </>
      )}
    </LoadingIndicator>
  );
}

export default PersonProfile;
