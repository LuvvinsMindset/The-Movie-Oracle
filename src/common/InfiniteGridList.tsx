import BaseGridList, { BaseGridListProps } from './BaseGridList';
import InfiniteScrollSentry, {
  InfiniteScrollSentryProps,
} from './InfiniteScrollSentry';

type InfiniteGridListProps = Pick<
  BaseGridListProps,
  'listEmptyMessage' | 'children'
> &
  InfiniteScrollSentryProps;

function InfiniteGridList({
  listEmptyMessage,
  hasNextPage,
  loading,
  children,
  onLoadMore,
}: InfiniteGridListProps) {
  return (
    <>
      <BaseGridList
        loading={loading || hasNextPage}
        listEmptyMessage={listEmptyMessage}
      >
        {children}
      </BaseGridList>
      <InfiniteScrollSentry
        loading={loading}
        hasNextPage={!!hasNextPage}
        onLoadMore={onLoadMore}
      />
    </>
  );
}

export default InfiniteGridList;
