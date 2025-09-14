// @ts-nocheck
import type { WithEditorProps } from '@/types';

import { FC } from 'react';

import type { TextProps } from './types';
import { EditorComponent } from '../shared/EditorComponent';
import { useEntity } from '@/hooks/use-entity';
import { TextEntity } from './text.entity';

export const TextEdit: FC<WithEditorProps<TextProps, TextEntity>> = ({
  mergedMeta: { text, ...meta },
  style,
  id,
  value,
}) => {
  const { addOverride } = useEntity<TextEntity>(id);
  return (
    <EditorComponent
      onChange={t => {
        addOverride({ text: t });
      }}
      isEditMode={true}
    >
      {text}
    </EditorComponent>
  );
};

export const TextRender: FC<WithEditorProps<TextProps, TextEntity>> = ({
  mergedMeta: { text },
}) => {
  return { text };
};
