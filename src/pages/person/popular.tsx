import PersonCard from '@/people/PersonCard';
import BaseSeo from '@/seo/BaseSeo';
import { PaginationResponse } from '@/common/CommonTypes';
import { dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import { getAllPageResults } from '@/common/CommonUtils';
import { createQueryClient } from '@/http-client/queryClient';
import PageTitle from '@/common/PageTitle';
import { Person } from '@/people/PeopleTypes';
import { apiConfigurationAPI } from '@/api-configuration/apiConfigurationAPI';
import { peopleAPI } from '@/people/peopleAPI';
import InfiniteGridList from '@/common/InfiniteGridList';
import { GetServerSideProps } from 'next';
import { useTranslation } from '@/translations/useTranslation';

function PopularPeoplePage() {
  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery<
    PaginationResponse<Person>
  >(peopleAPI.popularPeople());
  const { t } = useTranslation();

  return (
    <>
      <BaseSeo title={t('popularPeople')} description={t('popularPeople')} />
      <PageTitle title={t('popularPeople')} />
      <InfiniteGridList
        loading={isFetching}
        hasNextPage={!!hasNextPage}
        onLoadMore={fetchNextPage}
      >
        {getAllPageResults(data).map((person) => {
          return (
            <li key={person.id}>
              <PersonCard person={person} />
            </li>
          );
        })}
      </InfiniteGridList>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.fetchQuery(apiConfigurationAPI.configuration()),
    queryClient.fetchInfiniteQuery(peopleAPI.popularPeople()),
  ]);

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default PopularPeoplePage;
