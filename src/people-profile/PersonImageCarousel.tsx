import ImageGalleryModal from '@/media-gallery/ImageGalleryModal';
import { Person } from '@/people/PeopleTypes';
import { useQuery } from '@tanstack/react-query';
import BaseCarousel from '@/common/BaseCarousel';
import ImageCarouselItem from '@/common/ImageCarouselItem';
import { peopleAPI } from '@/people/peopleAPI';
import { useTranslation } from '@/translations/useTranslation';

interface PersonImageCarouselProps {
  person: Person;
}

function PersonImageCarousel({ person }: PersonImageCarouselProps) {
  const { data, isLoading } = useQuery(peopleAPI.personDetails(person.id));
  const { t } = useTranslation();
  const filePaths =
    data?.images.profiles.map((profile) => profile.file_path) || [];

  return (
    <>
      <BaseCarousel
        key={person.id}
        loading={isLoading}
        slidesPerView={{ default: 2, md: 5, lg: 7 }}
        listEmptyMessage={t('noImages')}
      >
        {filePaths.map((filePath, i) => {
          return (
            <ImageCarouselItem
              key={filePath}
              filePath={filePath}
              imageAlt={`${person.name} ${t('images')} ${i + 1}`}
              width={2}
              height={3}
            />
          );
        })}
      </BaseCarousel>
      <ImageGalleryModal title={person.name} filePaths={filePaths} />
    </>
  );
}

export default PersonImageCarousel;
