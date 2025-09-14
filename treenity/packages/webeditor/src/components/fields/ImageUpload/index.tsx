// @ts-nocheck
import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import { FieldWrapper } from '@/components/fields/shared/wrapper';
import type { CustomField as ICustomField } from '@/types/fields';

import styled from '@emotion/styled';
import { Button, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

const StyledImage = styled.img`
  aspect-ratio: 1/1;
  width: 140px;
  border-radius: 1rem;
  object-fit: cover;
  margin-top: 0.5rem;
`;

const ImageUpload: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<string>({
    name,
  });
  const { error } = message;

  const handleImageUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 3 * 1024 * 1024) {
          error('Image size exceeding 3mb');
          return (event.target.value = '');
        }

        if (!file.type.startsWith('image/')) {
          error('Invalid file type');
          return (event.target.value = '');
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          const res = reader.result as string;
          handleChange(res);
        };
        reader.readAsDataURL(file);
      }
    },
    [error, handleChange],
  );

  return (
    <>
      <FieldWrapper label={field?.label || name}>
        {localValue ? (
          <>
            <label htmlFor="image">
              <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <StyledImage alt={'test'} style={{}} src={localValue} />
            </label>
            <Button
              type={'default'}
              onClick={() => {
                handleChange('');
              }}
            >
              Remove image
            </Button>
          </>
        ) : (
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
        )}
      </FieldWrapper>
    </>
  );
});

export default ImageUpload;
