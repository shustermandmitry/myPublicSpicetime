import { Entity } from '@treenity/entity';
import { Input, Space, Typography } from 'antd';
import React from 'react';
import Chat from './chat';
import { CodeComponentEntity } from './CodeComponent.entity';

const { TextArea } = Input;

interface AICodeGeneratorProps {
  mergedMeta: Partial<CodeComponentEntity>;
  value: Entity<CodeComponentEntity>;
}

export const AICodeGenerator: React.FC<AICodeGeneratorProps> = ({ value, mergedMeta }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      AI Code Generator
      <Chat entity={value} history={mergedMeta.ai!.messages} />
      <TextArea
        rows={10}
        value={mergedMeta.code}
        onChange={e => {
          value.changeCode(e.target.value);
        }}
        placeholder="Generated code will appear here"
      />
      {value.typeId && (
        <Typography.Text type="secondary">Connected to type: {value.typeId}</Typography.Text>
      )}
    </Space>
  );
};
