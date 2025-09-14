import { useLayout } from '@/context/LayoutContext';
import type { ArrayField, CustomField, ObjectField } from '@/types/fields';
import { parseSchemaProperties } from '@/utils/parse-style-schema';
import { useEditor } from '@craftjs/core';
import styled from '@emotion/styled';
import { EmptyState } from '@treenity/admin-components/components';
import { CollapseContainer } from '@treenity/admin-components/widgets';
import { types } from '@treenity/core';
import { Form } from 'antd';
import { FC, useMemo } from 'react';
import { Field, isArrayField, isObjectField } from './Field';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DONT_RENDER_FIELDS = ['ai', 'styles', 'code', 'prompt', 'appliedCode'];

type FieldType = CustomField | ObjectField | ArrayField;
type FieldEntry = [string, FieldType];

const useComponentFields = () => {
  const { node, actions } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      active: currentlySelectedNodeId,
      node: state.nodes[currentlySelectedNodeId],
    };
  });
  const { config } = useLayout();

  return useMemo(() => {
    if (!node || !config) return null;
    const type = node.data.name;

    const componentConfig = config.components[type];
    if (!componentConfig) return null;

    let fields = componentConfig.fields;

    const settingsFields: FieldEntry[] = [];
    const complexFields: FieldEntry[] = [];

    const dynamicFunc = types.schema.getSync('dynamic', type)?.component;
    if (dynamicFunc) {
      // @ts-ignore
      const schema = dynamicFunc({ $id: node.id });
      if (schema) {
        try {
          const dynamicFields = parseSchemaProperties({ gen: schema }, schema.definitions);
          fields = Object.assign({}, fields, dynamicFields);
        } catch (e) {
          console.error('Error parsing dynamic fields', e);
        }
      }
    }

    Object.entries(fields).forEach(([key, field]) => {
      if (DONT_RENDER_FIELDS.includes(key)) return;
      if (isObjectField(field) || isArrayField(field)) {
        complexFields.push([key, field]);
      } else {
        settingsFields.push([key, field]);
      }
    });

    return { settingsFields, complexFields };
  }, [node, config]);
};

const Settings: FC = () => {
  const fields = useComponentFields();

  if (!fields) {
    return <EmptyState title="Please select a component" subtitle="To customize its settings" />;
  }

  return (
    <Form>
      <Root>
        <Form.Item name="settings">
          {fields.settingsFields.length > 0 && (
            <CollapseContainer title="Settings" isOpen>
              {fields.settingsFields.map(([baseKey, field]) => (
                <Field key={baseKey} baseKey={baseKey} field={field} />
              ))}
            </CollapseContainer>
          )}
          {fields.complexFields.map(([baseKey, field]) => (
            <CollapseContainer key={baseKey} title={field.label || baseKey} isOpen>
              <Field baseKey={baseKey} field={field} showLabel={false} />
            </CollapseContainer>
          ))}
        </Form.Item>
      </Root>
    </Form>
  );
};

export default Settings;
