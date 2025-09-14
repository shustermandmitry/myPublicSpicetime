// @ts-nocheck
import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import { OverrideValue } from '@/components/fields/shared/override-value';
import { FieldWrapper } from '@/components/fields/shared/wrapper';
import type { RadioField as IRadioField } from '@/types/fields';

import type { RadioChangeEvent } from 'antd';
import { Flex, Radio } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
type Option = {
  label: string;
  value: string | number | boolean;
};

const RadioField: IRadioField['render'] = observer(({ name, field, options }) => {
  const { localValue, handleChange, inheritedFrom, hasOverrideValue, handleRemoveOverwrite } =
    useCustomField<boolean>({
      name,
    });

  const onInputChange = React.useCallback(
    (e: RadioChangeEvent) => handleChange(e.target.value),
    [handleChange],
  );

  return (
    <FieldWrapper label={field?.label || name}>
      <Flex vertical gap="middle">
        <Radio.Group
          onChange={onInputChange}
          defaultValue={localValue}
          size={'large'}
          buttonStyle="solid"
        >
          {options?.map(option => {
            return (
              <Radio.Button key={option.value as string} value={option.value}>
                {option.label}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </Flex>
      <OverrideValue hasOverrideValue={hasOverrideValue} onRemoveValue={handleRemoveOverwrite} />
    </FieldWrapper>
  );
});
export default RadioField;
