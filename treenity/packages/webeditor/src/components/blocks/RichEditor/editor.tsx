import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import useCurrentScreenSize from '@/hooks/use-current-screen-size';
import { WithEditorProps } from '@/types';
import { useEditor } from '@craftjs/core';
import styled from '@emotion/styled';

import { Color } from '@tiptap/extension-color';

import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import type { EditorOptions } from '@tiptap/react';
import { EditorContent, useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import FontSize from 'tiptap-extension-font-size';

import { useDebouncedCallback } from 'use-debounce';
import { LineHeight } from './extensions/LineHeight';
import { Underline } from './extensions/Underline';

import { useFocusOnSelect } from './hooks/use-focus-on-select';
import { useStopClickPropagation } from './hooks/use-stop-click-propagation';
import { RenderEditorState } from './render';
import { RichEditorEntity } from './richeditor.entity';
import RichTextToolbar from './toolbar';
import type { RichEditorProps } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height attribute
       */
      setLineHeight: (height: string) => ReturnType;
      /**
       * Unset the text align attribute
       */
      unsetLineHeight: () => ReturnType;
    };
    underline: {
      toggleUnderline: () => ReturnType;
    };
  }
}

const tiptapExtensions = [
  StarterKit,
  Color.configure(),
  Link.configure(),
  FontSize,
  LineHeight,
  FontFamily.configure(),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Underline,
];

export const Editor: FC<WithEditorProps<RichEditorProps, RichEditorEntity>> = ({
  mergedMeta: { state, ...meta },
  id,
  style,
}) => {
  const screen = useCurrentScreenSize();

  const { isSelected } = useEditor((_, query) => ({
    isSelected: query.getEvent('selected').contains(id),
  }));

  const { handleChange, handleRemoveOverwrite, hasOverrideValue, localValue } = useCustomField({
    name: 'state',
    id,
    value: state,
  });

  const localValueRef = useRef(localValue);

  const editor = useTiptapEditor(
    {
      extensions: tiptapExtensions,
      content: state,
      editable: false,
    },
    [screen],
  );

  const debouncedHandleChange = useDebouncedCallback(handleChange, 300);
  useEffect(() => {
    localValueRef.current = localValue;

    if (localValue !== editor?.getHTML()) {
      editor?.commands.setContent(localValue);
    }
  }, [localValue, editor]);

  useEffect(() => {
    if (!editor) return;

    const onEditorUpdate: EditorOptions['onUpdate'] = ({ editor }) => {
      if (localValue === editor.getHTML()) return;
      debouncedHandleChange(editor.getHTML());
    };

    editor.on('update', onEditorUpdate);

    return () => {
      editor.off('update', onEditorUpdate);
    };
  }, [editor, handleChange, localValue]);

  useStopClickPropagation(id);
  useFocusOnSelect(isSelected, editor);

  return (
    <Root className="editor" isSelected={isSelected} style={style}>
      {editor && isSelected ? (
        <>
          <RichTextToolbar
            editor={editor}
            id={id}
            onRemoveOverwrite={() => {
              flushSync(() => {
                handleRemoveOverwrite();
              });
              editor.commands.setContent(localValueRef.current);
            }}
            hasOverrides={hasOverrideValue}
          />
          <EditorContent
            style={{
              position: 'relative',
            }}
            editor={editor}
          />
        </>
      ) : (
        <RenderEditorState state={state} />
      )}
    </Root>
  );
};

const Root = styled('div')<{ isSelected: boolean }>`
  padding-left: 4px;
  cursor: ${({ isSelected }) => (isSelected ? 'default' : 'grab')};
  pointer-events: auto;
  padding-left: 1px;

  p {
    margin: 0;
  }

  [contenteditable]:focus {
    outline: none;
    border: none;
  }
`;
