/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { ContainerProps } from './types';

export const ContainerType = metaType<ContainerEntity>('markup.container');

@entity(ContainerType)
export class ContainerEntity {
  styles: ContainerProps['styles'] = {};
}
