import type { ISelectIconField } from '@/types/fields';
import styled from '@emotion/styled';
import { Icon, iconNames, Select, TextContent } from '@treenity/admin-components/components';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { useCustomField } from '../shared/hooks/use-custom-field';
import { FieldWrapper } from '../shared/wrapper';

interface ISelectIconOption {
  value: string;
  label: ReactNode;
}

export const SelectIconField: ISelectIconField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<string>({
    name,
  });

  const options: ISelectIconOption[] = iconNames.map(iconName => ({
    value: iconName,
    label: (
      <IconOptionItem>
        <Icon name={iconName} />
        <TextContent size={8} fontWeight={700} lineHeight={1.4} letterSpacing={-0.16}>
          {iconName}
        </TextContent>
      </IconOptionItem>
    ),
  }));

  const onSelectChange = React.useCallback((value: string) => handleChange(value), [handleChange]);

  return (
    <FieldWrapper label={field.label || name}>
      <SelectStyled
        size="x-small"
        suffixIcon={<Icon name="arrow-bottom_outlined" />}
        options={options}
        value={localValue}
        onChange={onSelectChange}
        virtual={false}
      />
    </FieldWrapper>
  );
});

const SelectStyled = styled(Select)`
  .rc-virtual-list-holder::-webkit-scrollbar {
    width: 0;
  }
`;
const IconOptionItem = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

export default SelectIconField;
