/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import { FC } from 'react';
import EmptyState from './EmptyState';

const EmptyEditPanel: FC = () => {
  return (
    <EmptyState title="No data found" subtitle="Nothing was found for the query">
      <ButtonWithIcon
        type="secondary-outlined"
        size="x-small"
        icon={<Icon name="arrows-refresh_outlined" />}
      >
        Reset search
      </ButtonWithIcon>
    </EmptyState>
  );
};

export default EmptyEditPanel;
