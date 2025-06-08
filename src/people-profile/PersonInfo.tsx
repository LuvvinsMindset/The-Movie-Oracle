import TextWithLabel from '@/common/TextWithLabel';
import { Person } from '@/people/PeopleTypes';
import { Box } from '@mui/material';
import { useTranslation } from '@/translations/useTranslation';

enum Genders {
  FEMALE = 1,
  MALE = 2,
}

interface PersonInfoProps {
  person: Person;
}

function PersonInfo({ person }: PersonInfoProps) {
  const { t } = useTranslation();

  function getGender() {
    switch (person.gender) {
      case Genders.FEMALE:
        return t('female');
      case Genders.MALE:
        return t('male');
      default:
        return '';
    }
  }

  if (!person) {
    return null;
  }

  const gender = getGender();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {gender && <TextWithLabel label={t('gender')} text={gender} />}
      {person.birthday && (
        <TextWithLabel label={t('birthday')} text={person.birthday} />
      )}
      {person.place_of_birth && (
        <TextWithLabel label={t('placeOfBirth')} text={person.place_of_birth} />
      )}
      {person.official_site && (
        <TextWithLabel label={t('officialSite')} text={person.official_site} />
      )}
    </Box>
  );
}

export default PersonInfo;
