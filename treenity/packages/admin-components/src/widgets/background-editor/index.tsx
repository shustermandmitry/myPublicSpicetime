/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ColorPicker from '@/components/color-picker';
import Select from '@/components/select';
import {
  defaultAllowedImageSize,
  defaultAllowedImageTypes,
  normalizeSize,
  normalizeType,
} from '@/utils/uploader/normalize';
import CollapseContainer from '@/widgets/CollapseContainer';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FC } from 'react';
import BgPositionThemed, { defaultBgPositionValues } from '../background-position-editor';
import GradientThemed, { defaultBgGradientValues } from '../gradient-editor';
import InputUploader from '../input-uploader';
import type { BackgroundThemedProps, BackgroundThemedValue } from './types';

export const ListAlignVertical = [
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Contain',
    value: 'contain',
  },
  {
    label: 'Cover',
    value: 'cover',
  },
];

const _defaultAllowedImageWeight = defaultAllowedImageSize();

const beforeUpload = async (file: RcFile) => {
  if (file.size > _defaultAllowedImageWeight) {
    console.log(`File should be less than ${normalizeSize(_defaultAllowedImageWeight)}!`);
    return false;
  }

  if (!defaultAllowedImageTypes.includes(file.type)) {
    console.log(`You can only upload ${normalizeType(defaultAllowedImageTypes)} file!`);
    return false;
  }

  return true;
};

export const backgroundDefaultValue: BackgroundThemedValue = {
  backgroundColor: null,
  backgroundSize: 'auto',
  backgroundImage: undefined,
  backgroundGradient: defaultBgGradientValues,
  backgroundPosition: defaultBgPositionValues,
};

const BackgroundThemed: FC<BackgroundThemedProps> = ({ onChange, value }) => {
  const handleChange = <K extends keyof BackgroundThemedValue>(
    name: K,
    newValue?: BackgroundThemedValue[K],
  ) => {
    const updateValue = { ...value, [name]: newValue } as BackgroundThemedValue;

    onChange?.(updateValue);
  };

  const _backgroundColor = value?.backgroundColor;

  return (
    <Root>
      <PanelItem label="BG color">
        <ColorPicker
          size="small"
          value={
            !_backgroundColor || _backgroundColor === 'transparent' ? null : value?.backgroundColor
          }
          onChange={value => handleChange('backgroundColor', value ? value?.toHexString() : null)}
        />
      </PanelItem>
      <PanelItem label="Image">
        <InputUploader
          value={value?.backgroundImage?.name}
          onChange={value =>
            handleChange('backgroundImage', {
              key: value,
              name: value,
            })
          }
        />
      </PanelItem>
      <PanelItem label="Size">
        <Select
          value={value?.backgroundSize}
          size="x-small"
          style={{ width: '100%' }}
          options={ListAlignVertical}
          onChange={value => handleChange('backgroundSize', value)}
        />
      </PanelItem>
      <CollapseContainerStyled title="Position">
        <BgPositionThemed
          onChange={value => handleChange('backgroundPosition', value)}
          imageStyle={value}
          value={value?.backgroundPosition}
        />
      </CollapseContainerStyled>
      <CollapseContainerStyled title="Gradient" isOpen>
        <GradientThemed
          onChange={value => handleChange('backgroundGradient', value)}
          value={value?.backgroundGradient || defaultBgGradientValues}
        />
      </CollapseContainerStyled>
    </Root>
  );
};

const CollapseContainerStyled = styled(CollapseContainer)`
  &&& .ant-collapse-content-box {
    padding-inline: 0;
  }

  &&& .ant-collapse-header {
    padding: 0;

    .ant-collapse-header-text {
      font-size: 12px;
      letter-spacing: -0.48px;
    }
  }

  border-bottom: none;
`;

const UploadStyled = styled(Upload)`
  width: 100%;
  display: block;
  line-height: 1;

  .ant-upload.ant-upload-select {
    width: 100%;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default BackgroundThemed;
export type { BackgroundThemedValue };
