import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import { TreenityPropsInput } from '@/components/fields/shared/input';
import type { CustomField as ICustomField } from '@/types/fields';

import { observer } from 'mobx-react-lite';
import React from 'react';

export const NumberField: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<number>({
    name,
  });

  const onValueChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleChange(+e.target.value),
    [handleChange],
  );

  return (
    <TreenityPropsInput
      id={name}
      label={field?.label || name}
      type={'number'}
      value={localValue}
      onChange={onValueChange}
    />
  );
});

export default NumberField;
