import BaseGridList from '@/common/BaseGridList';
import { ID } from '@/common/CommonTypes';
import { useQuery } from '@tanstack/react-query';
import MovieCard from '@/movies/MovieCard';
import { peopleAPI } from '@/people/peopleAPI';
import { useTranslation } from '@/translations/useTranslation';
import _ from 'lodash';

interface PersonCrewGridListProps {
  personId: ID;
}

function PersonCrewGridList({ personId }: PersonCrewGridListProps) {
  const { data, isLoading } = useQuery(peopleAPI.personDetails(personId));
  const { t } = useTranslation();
  const crewList = _.uniqBy(data?.credits.crew ?? [], (crew) => crew.id);

  return (
    <BaseGridList
      loading={isLoading}
      listEmptyMessage={t('noCrew')}
    >
      {crewList.map((personCrew) => {
        const allJobs = data?.credits.crew
          .filter((crew) => crew.id === personCrew.id)
          .map((crew) => crew.job);
        return (
          <li key={personCrew.id}>
            <MovieCard movie={personCrew} subheader={allJobs?.join(', ')} />
          </li>
        );
      })}
    </BaseGridList>
  );
}

export default PersonCrewGridList;
