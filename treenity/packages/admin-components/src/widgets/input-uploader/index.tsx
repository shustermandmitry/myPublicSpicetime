import Button from '@/components/button';
import Icon from '@/components/icon';
import Input from '@/components/input';
import Segmented from '@/components/Segmented';
import {
  defaultAllowedImageSize,
  defaultAllowedImageTypes,
  normalizeSize,
  normalizeType,
} from '@/utils';
import getBackgroundImageUrl from '@/utils/uploader/get-image-type';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { getImageAction } from '@treenity/ui-kit/utils';
import { InputRef, Upload, type UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { ChangeEventHandler, type FC, useRef, useState } from 'react';

interface InputUploaderProps {
  onChange(value: string): void;
  value?: string;
}

export const uploadSegmentedOptions = [
  {
    label: 'Upload',
    value: 'upload',
  },
  {
    label: 'URL',
    value: 'url',
  },
];

const InputUploader: FC<InputUploaderProps> = ({ value, onChange }) => {
  const [uploadType, setUploadType] = useState('upload');
  const inputRef = useRef<InputRef>(null);
  const uploadRef = useRef<any>(null);

  const [inputValue, setInputValue] = useState<string | undefined>(value || '');

  const action = getImageAction();
  const defaultSizeImage = defaultAllowedImageSize();
  const defaultTypeImage = defaultAllowedImageTypes;

  const [showLoader, setShowLoader] = useToggle();
  const [errorText, setErrorText] = useState<string | undefined>();

  const beforeUpload = async (file: RcFile) => {
    if (file.size > defaultSizeImage) {
      setErrorText(`File should be less than ${normalizeSize(defaultSizeImage)}!`);
      return false;
    }

    if (!defaultTypeImage.includes(file.type)) {
      setErrorText(`You can only upload ${normalizeType(defaultTypeImage)} file!`);
      return false;
    }

    setErrorText(undefined);
    return true;
  };

  const onUpload: UploadProps['onChange'] = info => {
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

      onChange(response.key);
      setInputValue(response.key);
    }
  };

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = event => {
    const value = event?.target?.value;
    setInputValue(value);

    if (value?.match(/https?:\/\//i) || value?.match(/^[a-f0-9]{64}$/i)) {
      onChange(value);
    }
  };

  const onRemove = () => {
    setInputValue(undefined);
    onChange('');
  };

  const handleChooseImage = () => {
    // Программно вызываем клик по скрытому input файла
    const fileInput = document.querySelector('.ant-upload input[type="file"]');

    if (fileInput) {
      (fileInput as HTMLElement).click();
    }
  };

  return (
    <>
      <Content>
        <Segmented
          size="small"
          block
          options={uploadSegmentedOptions}
          value={uploadType}
          onChange={setUploadType}
        />

        {uploadType === 'upload' && (
          <UploadStyled
            ref={uploadRef}
            action={action}
            data-testid="right-upload"
            onChange={onUpload}
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            <Button
              disabled={showLoader}
              type="secondary-outlined"
              size="x-small"
              icon={<Icon name="import_outlined" rotate={90} />}
              loading={showLoader}
            >
              Upload
            </Button>
          </UploadStyled>
        )}
        {uploadType === 'url' && (
          <Input
            placeholder="Image URL"
            disabled={showLoader}
            ref={inputRef}
            size="x-small"
            onChange={onChangeInput}
            value={inputValue}
          />
        )}
      </Content>
      <PreviewContainer>
        <Preview
          src={getBackgroundImageUrl(
            value || '9bfa93ddb8ec4f6c38d2ac459117e5813d505ab1607e0207c09c810e4fe8e15f',
          )}
          alt=""
        />
        <Buttons>
          {uploadType === 'upload' && (
            <Button
              size="x-small"
              type="secondary-outlined"
              onClick={handleChooseImage}
              disabled={showLoader}
              loading={showLoader}
            >
              Choose image
            </Button>
          )}
          <Button size="x-small" type="secondary-outlined" icon="trash_filled" onClick={onRemove} />
        </Buttons>
      </PreviewContainer>
      {errorText && <ErrorText>{errorText}</ErrorText>}
    </>
  );
};

const Buttons = styled.div`
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: flex;
  gap: 4px;

  && button:not(:disabled):not(button.ant-btn-disabled) i {
    color: ${p => p.theme.colorErrorText};
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 110px;
  height: 110px;
  margin-top: 4px;
  border-radius: 8px;
  overflow: hidden;
  background: ${p => p.theme.colorBgContainer};
  border: 1px solid ${p => p.theme.colorBorder};
`;

const Preview = styled.img`
  max-width: 100%;
  max-height: 110px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: block;
  object-fit: scale-down;
`;

const UploadStyled = styled(Upload)`
  line-height: 1;

  &,
  .ant-upload,
  button {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ErrorText = styled.div`
  color: ${p => p.theme.colorErrorText};
  font-size: 10px;
  margin-top: 4px;
`;

export default InputUploader;
