import { useLayout } from '@/context/LayoutContext';
import { useEditor } from '@craftjs/core';
import styled from '@emotion/styled';
import { capitalize } from '@s-libs/micro-dash';
import { EmptyState } from '@treenity/admin-components/components';
import { CollapseContainer } from '@treenity/admin-components/widgets';
import { RENDER_CONTEXT, RenderContextProvider } from '@treenity/ui-kit';
import { Form } from 'antd';
import React, { useMemo } from 'react';

type Field = {
  label: string;
  type: string;
  render: (props: { name: string; label?: string }) => React.ReactNode;
  objectFields?: Record<string, Field>;
};

interface FieldProps {
  name: string;
  field: Field;
}

export const Field: React.FC<FieldProps> = React.memo(({ name, field }) => {
  if ('render' in field && field.render) {
    return (
      <CollapseContainer title={capitalize(field.label) || name} isOpen={true}>
        <Form.Item name={field.label}>
          <field.render name={'styles.' + name} />
        </Form.Item>
      </CollapseContainer>
    );
  }

  if (field.objectFields) {
    return (
      <div
        style={{
          border: '1px solid #e2e8f0',
          padding: '10px',
          borderRadius: '0.5rem',
        }}
      >
        <p>{field.label}</p>
        <FieldList fields={field.objectFields} baseName={name} />
      </div>
    );
  }
  return null;
});

export const FieldList: React.FC<{ fields: Record<string, Field>; baseName: string }> = React.memo(
  ({ fields, baseName }) => {
    return Object.entries(fields).map(([key, field]) => {
      const name = baseName ? `${baseName.toLowerCase()}.${key}` : key;
      return <Field key={name} name={name} field={field} />;
    });
  },
);

const Styles: React.FC = () => {
  // const selectedItem = useEditorStore(state => state.selectedItem);
  const { config } = useLayout();

  const { active, node, actions } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      active: currentlySelectedNodeId,
      node: state.nodes[currentlySelectedNodeId],
    };
  });

  const editorComponent = useMemo(() => {
    if (!node || !config) return null;
    const type = node.data.name;
    return config.components[type] || null;
  }, [node, config]) as {
    fields?: {
      styles?: {
        objectFields: Record<string, Field>;
      };
    };
  };

  if (!editorComponent) {
    return <EmptyState title="Please select a component" subtitle="To customize the settings" />;
  }

  return (
    <RenderContextProvider value={RENDER_CONTEXT.WIDGET}>
      <Container>
        {editorComponent.fields?.styles?.objectFields ? (
          <FieldList
            fields={editorComponent.fields.styles.objectFields! as Record<string, Field>}
            baseName=""
          />
        ) : null}
      </Container>
    </RenderContextProvider>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colorBgPanel};
  width: 320px;
  user-select: none;

  .ant-form-item .ant-form-item-control-input {
    min-height: initial;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;

export default Styles;
