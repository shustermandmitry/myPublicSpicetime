// @ts-nocheck

import { screenSizes } from '@/constants';
import type { ArrayField } from '@/types/fields';
import styled from '@emotion/styled';
import {
  Button as TreenityButton,
  ButtonWithIcon,
  Icon,
} from '@treenity/admin-components/components';
import { Entity } from '@treenity/entity';
import { Render } from '@treenity/ui-kit';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { Field } from '../../Siders/RightSidebar/Settings/Field';
import { useCustomField } from '../shared/hooks/use-custom-field';

function removeIndexedOverrides(entity: Entity<any>, path: string) {
  return screenSizes.forEach(screenSize => {
    Object.keys(entity.$.getVariant(screenSize) || {}).forEach(override => {
      if (override.startsWith(path)) {
        entity.$.removeVariantOverride(screenSize, override);
      }
    });
  });
}

const Button = styled(TreenityButton)`
  width: 100%;
`;

const ArrayField: ArrayField['render'] = observer(({ name, field, widget }) => {
  const { localValue, updateEntity, entity } = useCustomField<[]>({
    name,
  });

  const onAdd = useCallback(() => {
    if (field.type !== 'array') return;
    const newValue = [...localValue, field.defaultItemProps];
    updateEntity(newValue);
  }, [localValue]);

  const onRemove = useCallback(
    (index: number) => {
      const newValue = localValue.filter((_, i) => i !== index);
      updateEntity(newValue);
      removeIndexedOverrides(entity, name);
    },
    [entity, localValue],
  );

  const label =
    field.arrayFields?.item?.['label'] || field.arrayFields?.label?.toString() || `Item`;

  return (
    <Root>
      {localValue?.map((item, index) => {
        return (
          <ListItem key={`${name}[${index}]`}>
            {Object.values(field?.arrayFields || {}).map(field => {
              if (widget) {
                return (
                  <Render
                    value={'REMOVE_ME_LATER'}
                    url={widget}
                    field={field}
                    key={JSON.stringify(item)}
                    name={`${name}[${index}]`}
                  />
                );
              }
              return (
                <Field
                  key={`${name}[${index}]`}
                  baseKey={`${name}[${index}]`}
                  field={field}
                  showLabel={false}
                />
              );
            })}
            <ButtonWithIcon
              onClick={() => onRemove(index)}
              danger
              size="x-small"
              type="secondary-filled"
              icon={<Icon name="trash_outlined" />}
            >
              Remove {label}
            </ButtonWithIcon>
          </ListItem>
        );
      })}
      <Button type="primary" size="x-small" onClick={onAdd} icon={<Icon name="plus_outlined" />}>
        Add {label}
      </Button>
    </Root>
  );
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ListItem = styled.div`
  padding: 6px;
  border-radius: 6px;
  border: 1px solid ${p => p.theme.gray400};
  background: ${p => p.theme.colorBgContainer};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default ArrayField;
