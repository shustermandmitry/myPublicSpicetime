// @ts-nocheck
import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import { FieldWrapper } from '@/components/fields/shared/wrapper';
import type { CustomField as ICustomField } from '@/types/fields';
import { InputUploader } from '@treenity/admin-components/widgets';
import { observer } from 'mobx-react-lite';
import React from 'react';

const ImageUploadInput: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<string>({
    name,
  });

  return (
    <>
      <FieldWrapper label={field?.label || name}>
        <InputUploader onChange={handleChange} value={localValue} />
      </FieldWrapper>
    </>
  );
});

export default ImageUploadInput;
