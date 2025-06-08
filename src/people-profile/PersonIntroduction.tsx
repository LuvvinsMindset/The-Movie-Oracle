import { Typography, Stack } from '@mui/material';
import Introduction from '@/introduction/Introduction';
import { Person } from '@/people/PeopleTypes';
import PersonInfo from './PersonInfo';
import { useTranslation } from '@/translations/useTranslation';

interface PersonIntroductionProps {
  person: Person;
}

function PersonIntroduction({ person }: PersonIntroductionProps) {
  const { t } = useTranslation();

  return (
    <Introduction
      imageSrc={person.profile_path}
      imageAlt={person.name}
      title={person.name}
      content={
        <Stack spacing={2}>
          {person.biography && (
            <div>
              <Typography variant="h6" gutterBottom>
                {t('biography')}
              </Typography>
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                }}
              >
                {person.biography}
              </Typography>
            </div>
          )}
          <div>
            <Typography variant="h6" gutterBottom>
              {t('personalInfo')}
            </Typography>
            <PersonInfo person={person} />
          </div>
        </Stack>
      }
    />
  );
}

export default PersonIntroduction;
