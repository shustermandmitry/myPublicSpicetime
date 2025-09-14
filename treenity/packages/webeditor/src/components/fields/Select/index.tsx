// @ts-nocheck
import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import type { SelectField as ISelectField } from '@/types/fields';
import { Icon, Segmented, Select } from '@treenity/admin-components/components';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { FieldWrapper } from '../shared/wrapper';

export const SelectField: ISelectField['render'] = observer(({ name, field, options }) => {
  const { localValue, handleChange } = useCustomField<ISelectField['options'][number]>({
    name,
  });

  const onSelectChange = React.useCallback(value => handleChange(value), [handleChange]);

  const component = useMemo(() => {
    if (options.length > 3) {
      return (
        <Select
          size="x-small"
          suffixIcon={<Icon name="arrow-bottom_outlined" />}
          options={options}
          value={localValue}
          onChange={onSelectChange}
        />
      );
    } else {
      return (
        <Segmented
          block
          size="small"
          options={options}
          value={localValue}
          onChange={onSelectChange}
        />
      );
    }
  }, [options, localValue, onSelectChange]);

  return <FieldWrapper label={field.label || name}>{component}</FieldWrapper>;
});

export default SelectField;
