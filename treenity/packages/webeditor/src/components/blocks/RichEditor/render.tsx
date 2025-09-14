import type { FC } from 'react';

import type { RichEditorProps } from './types';
import { RichEditorEntity } from './richeditor.entity';
import { WithEditorProps } from '@/types';

const replaceEmptyParagraphs = (content: string): string => {
  return content.replaceAll('<br></', '<br><br></').replaceAll('<p></p>', '<p><br></p>');
};

export const Render: FC<WithEditorProps<RichEditorProps, RichEditorEntity>> = ({
  mergedMeta: { state },
  style,
}) => {
  return <RenderEditorState state={state} style={style} />;
};

export const RenderEditorState: FC<{ state: string; style?: React.CSSProperties }> = ({
  state,
  style,
}) => {
  const processedContent = state ? replaceEmptyParagraphs(state) : '';
  return <div dangerouslySetInnerHTML={{ __html: processedContent }} style={style} />;
};
