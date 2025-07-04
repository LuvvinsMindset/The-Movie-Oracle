import { MediaType } from '@/common/CommonEnums';
import { isOfType } from '@/common/CommonUtils';
import { Person } from './PeopleTypes';

export function isPerson(value: any): value is Person {
  return (
    value.media_type === MediaType.PERSON ||
    isOfType<Person>(value, ['name', 'gender'])
  );
}
