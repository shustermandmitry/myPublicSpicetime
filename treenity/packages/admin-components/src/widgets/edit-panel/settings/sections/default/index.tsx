/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Input from '@/components/input';
import SegmentedThemed from '@/components/Segmented';
import Select from '@/components/select';
import PanelItem from '@/widgets/panel-item';
import WrapperWithReset from '@/widgets/WrapperWithReset';
import styled from '@emotion/styled';
import React, { FC, useMemo } from 'react';
import { tagsList, VISIBILITY_OPTIONS } from '../../list';
import type { DefaultSectionProps, IDefaultSectionValues } from './types';

export const defaultValueDefaultSection: IDefaultSectionValues = {
  id: '',
  tag: '',
  visibility: 'visible',
};

const DefaultSection: FC<DefaultSectionProps> = ({ value, onChange }) => {
  const handleChange = (name: keyof IDefaultSectionValues) => (values?: string) => {
    const newValue = { ...value, [name]: values } as IDefaultSectionValues;
    onChange(newValue);
  };

  const memoizedValue: IDefaultSectionValues = useMemo(
    () => Object.assign({}, defaultValueDefaultSection, value),
    [value],
  );

  return (
    <Root>
      <PanelItem label="ID">
        <WrapperWithReset onReset={() => handleChange('id')(undefined)}>
          <Input
            value={memoizedValue.id}
            placeholder="For in-page linking"
            onChange={e => handleChange('id')(e.target.value)}
          />
        </WrapperWithReset>
      </PanelItem>
      <PanelItem label="Tag">
        <Select
          options={tagsList('text')}
          value={memoizedValue.tag}
          placeholder="Section"
          size="x-small"
          style={{ width: '100%' }}
          onChange={handleChange('tag')}
        />
      </PanelItem>
      <PanelItem label="Position">
        <SegmentedThemed
          block
          size="small"
          options={VISIBILITY_OPTIONS}
          value={memoizedValue.visibility}
          onChange={handleChange('visibility')}
        />
      </PanelItem>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

export default DefaultSection;
