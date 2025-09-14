import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import { FieldWrapper } from '@/components/fields/shared/wrapper';
import type { CustomField as ICustomField } from '@/types/fields';

import { Textarea } from '@treenity/admin-components/components';
import { observer } from 'mobx-react-lite';
import React from 'react';

const TextAreaField: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<string>({
    name,
  });

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e.target.value),
    [handleChange],
  );

  return (
    <FieldWrapper label={field?.label || name}>
      <Textarea
        size="x-small"
        rows={5}
        aria-label={field?.label || name}
        id={field?.label || name}
        value={localValue || ''}
        onChange={onInputChange}
      />
    </FieldWrapper>
  );
});

export default TextAreaField;
