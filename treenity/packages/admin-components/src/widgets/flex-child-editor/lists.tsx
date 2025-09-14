import Icon from '@/components/icon';
import type { FlexChildSizingListType } from './types';

export const flexSizingOptions: FlexChildSizingListType[] = [
  {
    icon: <Icon name="flex-child-column-shrink_outlined" />,
    value: 'shrink',
  },
  {
    icon: <Icon name="flex-child-column-none_outlined" />,
    value: 'grow',
  },
  {
    icon: <Icon name="flex-child-column-grow_outlined" />,
    value: 'none',
  },
  {
    icon: <Icon name="kebab_filled" />,
    value: 'customize',
  },
];
