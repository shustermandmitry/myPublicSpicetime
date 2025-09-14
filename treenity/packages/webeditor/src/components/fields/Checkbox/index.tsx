import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import type { CustomField as ICustomField } from '@/types/fields';
import { Switch } from '@treenity/admin-components/components';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FieldWrapper } from '../shared/wrapper';

export const CheckboxField: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<boolean>({
    name,
  });

  const handleCheckboxChange = React.useCallback(
    (checked: boolean) => {
      handleChange(checked);
    },
    [handleChange],
  );

  return (
    <FieldWrapper label={field?.label || name} fullWithLabel>
      <Switch size="small" onChange={handleCheckboxChange} checked={localValue} id={name} />
    </FieldWrapper>
  );
});

export default CheckboxField;
