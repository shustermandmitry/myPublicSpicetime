/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import AnimatedLogo from '@/components/logo/AnimatedLogo';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { getImageAction, getImageUrl, omitProps } from '@treenity/ui-kit/utils';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { FC, useState } from 'react';
import {
  defaultAllowedImageSize,
  defaultAllowedImageTypes,
  normalizeSize,
  normalizeType,
} from '../utils/uploader/normalize';
import EmptyImage from './EmptyImage';

const imageSize = 64;

interface IUploadImage {
  value?: string;
  headerRender?: React.ReactNode;
  title?: string;
  description?: string;
  allowedImageSize?: number;
  allowedImageTypes?: string[];
  onSave?(img: string): void;
  onChange?(value: string): void;
}

const UploadImageRow: FC<IUploadImage> = ({
  title,
  description,
  value,
  allowedImageSize,
  allowedImageTypes,
  onChange,
}) => {
  const [showLoader, setShowLoader] = useToggle();
  const [errorText, setErrorText] = useState<string | undefined>();

  const _allowedSize = defaultAllowedImageSize(allowedImageSize);
  const _allowedType = allowedImageTypes || defaultAllowedImageTypes;
  const action = getImageAction();

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setShowLoader(true);
      return;
    }

    if (info.file.status === 'done') {
      setShowLoader(false);
      const { response } = info.file;
      if (!response) {
        return;
      }
      onChange && onChange(response.key);
    }
  };

  const beforeUpload = async (file: RcFile) => {
    if (file.size > _allowedSize) {
      setErrorText(`File should be less than ${normalizeSize(_allowedSize)}!`);
      return false;
    }

    if (!_allowedType.includes(file.type)) {
      setErrorText(`You can only upload ${normalizeType(_allowedType)} file!`);
      return false;
    }

    setErrorText(undefined);
    return true;
  };

  return (
    <>
      <Root data-testid="uploader">
        <LeftSideUpload
          data-testid={`left-upload-${title?.toLowerCase()}`}
          action={action}
          onChange={handleChange}
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <div data-testid="upload-container">
            {showLoader ? (
              <Avatar>
                <AnimatedLogo size={22} />
              </Avatar>
            ) : value ? (
              <ImageStyled
                isError={!!errorText}
                src={getImageUrl(256, 256, value)}
                width={imageSize}
                height={imageSize}
                alt="avatar"
              />
            ) : (
              <Avatar isError={!!errorText}>
                <EmptyImage />
              </Avatar>
            )}
          </div>
          <WrapText>
            <Title>{title || 'Upload image'}</Title>
            {description && <Description>{description}</Description>}
          </WrapText>
        </LeftSideUpload>
        <Upload
          action={action}
          data-testid="right-upload"
          onChange={handleChange}
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <Button type="secondary-filled" icon={<Icon name="upload_outlined" />}>
            Upload
          </Button>
        </Upload>
        {errorText && <ErrorUploadImage>{errorText}</ErrorUploadImage>}
      </Root>
    </>
  );
};

const ErrorUploadImage = styled.div`
  right: 0;
  width: fit-content;
  position: absolute;
  border-radius: 4px;
  background: ${p => p.theme.colorError};
  font-weight: 700;
  line-height: 100%;
  color: ${p => p.theme.Menu.itemSelectedColor};
  font-size: 10px;
  padding: 2px 4px;
  letter-spacing: -0.4px;
  height: 14px !important;
  bottom: -6px;
`;

const ImageStyled = styled('img', omitProps('isError'))<{ isError?: boolean }>`
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: block;
  background: ${p => (p.isError ? p.theme.colorErrorBg : p.theme.colorBgPanel)};
  border: 1px solid ${p => (p.isError ? p.theme.colorError : p.theme.gray400)};
`;

const Root = styled.div`
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSideUpload = styled(Upload)`
  cursor: pointer;

  .ant-upload {
    gap: 16px;
    display: flex;
    align-items: center;
  }
`;

const Avatar = styled('div', omitProps('isError'))<{ isError?: boolean }>`
  width: 60px;
  height: 60px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${p => (p.isError ? p.theme.colorError : p.theme.gray400)};

  ${p =>
    p.isError &&
    css`
      & > div {
        background-color: ${p.theme.colorErrorBg};

        path {
          fill: ${p.theme.colorError};
        }
      }
    `};

  &&& {
    transition: border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
  }

  i {
    display: flex;
  }
`;

const WrapText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${p => p.theme.colorTextBase};

  &&& {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
  }
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.48px;
  color: ${p => p.theme.colorGrayText};

  &&& {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
  }
`;

export default UploadImageRow;
