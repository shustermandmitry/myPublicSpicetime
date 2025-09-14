import { FC } from 'react';
import Icon from './Icon';

import { IconNames, IIcon } from './types';

export default function makeIcon<T extends IconNames>(iconNames: T): FC<IIcon<T>> {
  return Icon as unknown as FC<IIcon<T>>;
}
