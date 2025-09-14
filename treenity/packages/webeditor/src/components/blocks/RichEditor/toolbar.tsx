import * as Toolbar from '@/components/Toolbar/toolbar';
import ToolbarColorPicker from '@/components/ToolbarColorPicker';
import ToolbarInputSelect from '@/components/ToolbarInputSelect';
import ToolbarItem from '@/components/ToolbarItem';
import ToolbarSelect from '@/components/ToolbarSelect';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { Editor } from '@tiptap/react';
import { Icon, iconNames } from '@treenity/admin-components/components';
import { omitProps } from '@treenity/ui-kit/utils';

import { FC, ReactNode, SVGProps, useCallback } from 'react';

const FONT_SIZES = [8, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72];

type IconType = (typeof iconNames)[number];

const RichTextToolbar: FC<{
  id: string;
  editor: Editor | null;
  hasOverrides: boolean;
  onRemoveOverwrite: () => void;
}> = ({ id, editor, hasOverrides: hasOverrideValue, onRemoveOverwrite: handleRemoveOverwrite }) => {
  const isAnythingSelected = useCallback(() => {
    if (!editor) return false;
    const { state } = editor;
    const { from, to } = state.selection;
    return from !== to;
  }, [editor?.state?.selection]);

  const editorDefaultChain = () => {
    return editor?.chain().focus()?.[isAnythingSelected() ? 'focus' : 'selectAll']();
  };

  const formatItems: { value: string; label: ReactNode }[] = [
    {
      value: 'p',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.setParagraph().run()}>
          <Icon name={`par_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'link',
      label: (
        <ToolbarItem
          onClick={() => {
            const url = window.prompt('URL');
            if (!url) return;
            editor?.chain().focus().setLink({ href: url }).run();
          }}
        >
          <Icon name={`link-horizontal_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'codeBlock',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleCodeBlock().run()}>
          <Icon name={`code_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'blockquote',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleBlockquote().run()}>
          <Icon name={`add-quote_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h1',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 1 }).run()}>
          <Icon name={`add-headlines-1_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h2',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 2 }).run()}>
          <Icon name={`add-headlines-2_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h3',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 3 }).run()}>
          <Icon name={`add-headlines-3_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h4',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 4 }).run()}>
          <Icon name={`add-headlines-4_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h5',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 5 }).run()}>
          <Icon name={`add-headlines-5_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'h6',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleHeading({ level: 6 }).run()}>
          <Icon name={`add-headlines-6_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'Ordered List',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleOrderedList().run()}>
          <Icon name={`add-list-circle-filled_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
    {
      value: 'Bullet List',
      label: (
        <ToolbarItem onClick={() => editorDefaultChain()?.toggleBulletList().run()}>
          <Icon name={`add-list-letters-dots_outlined`} />
        </ToolbarItem>
      ) as ReactNode,
    },
  ];

  const lineHeightItems = ['1', '1.15', '1.5', '2', '2.5', '3'].map(height => ({
    value: height,
    label: (
      <ToolbarItem onClick={() => editorDefaultChain()?.setLineHeight(height).run()}>
        {height}
      </ToolbarItem>
    ),
  }));

  const textAlignItems = ['left', 'center', 'right'].map(align => ({
    value: align,
    label: (
      <ToolbarItem onClick={() => editorDefaultChain()?.setTextAlign(align).run()}>
        <Icon name={`align-${align}_outlined` as IconType} />
      </ToolbarItem>
    ),
  }));

  const fontItems = ['Arial', 'Inter', 'Manrope', 'Open Sans', 'Roboto', 'Oswald'].map(font => ({
    value: font,
    label: (
      <ToolbarItem align="left" onClick={() => editorDefaultChain()?.setFontFamily(font).run()}>
        <FontText fontFamily={font}>{font}</FontText>
      </ToolbarItem>
    ),
  }));

  const getCurrentFontFamily = useCallback(() => {
    const attributes = editor?.getAttributes('textStyle');
    return attributes?.fontFamily || 'Default';
  }, [editor]);

  const getCurrentTextAlign = () => {
    if (editor?.isActive({ textAlign: 'left' })) {
      return 'left';
    }
    if (editor?.isActive({ textAlign: 'center' })) {
      return 'center';
    }
    if (editor?.isActive({ textAlign: 'right' })) {
      return 'right';
    }
  };

  const getCurrentLineHeight = () => {
    const attributes = editor?.getAttributes('textStyle');
    return attributes?.lineHeight || '1';
  };

  return (
    <Toolbar.Root id={id}>
      {/* Remove Overwrite */}
      {hasOverrideValue && (
        <Group>
          <ToolbarItem onClick={handleRemoveOverwrite} interactive tooltip="Remove Styles">
            <Icon name="eraser_outlined" />
          </ToolbarItem>
        </Group>
      )}
      {/* Text Format */}
      <Group>
        <ToolbarSelect items={formatItems} value={getCurrentActiveFormat({ editor })} />
      </Group>
      {/* Font Family */}
      <Group>
        <ToolbarSelect
          items={fontItems}
          tooltip="Font Family"
          value={getCurrentFontFamily()}
          width={92}
          prefixIcon={<Icon name="font-type_outlined" />}
        />
      </Group>
      {/* Font Size */}
      <Group>
        <ToolbarInputSelect
          values={FONT_SIZES}
          tooltip="Font Size"
          prefixIcon={<Icon name="font-size_outlined" />}
          value={Number(editor?.getAttributes('textStyle')?.fontSize?.replace('px', '')) || 16}
          onChange={value => {
            if (editor && !isAnythingSelected()) {
              editor?.commands.selectAll();
            }
            editor?.commands.setFontSize(`${value}px`);
          }}
        />
      </Group>
      {/* Line Height */}
      <Group>
        <ToolbarSelect
          items={lineHeightItems}
          value={getCurrentLineHeight()}
          tooltip="Line Height"
          prefixIcon={<Icon name="line-height_outlined" />}
        />
      </Group>
      {/* Color Picker */}
      <Group>
        <ToolbarColorPicker editor={editor} isAnythingSelected={isAnythingSelected} />
      </Group>
      {/* Text Align */}
      <Group>
        <ToolbarSelect
          items={textAlignItems}
          value={getCurrentTextAlign()}
          tooltip="Text Align"
          hideIcon
          width={18}
        />
      </Group>
      {/* Text Style (Bold / Italic / Underline / Strike) */}
      <Group>
        <ToolbarItem
          onClick={() => editorDefaultChain()?.toggleBold().run()}
          active={editor?.isActive('bold')}
        >
          <Icon name="bold_outlined" />
        </ToolbarItem>
        <ToolbarItem
          onClick={() => editorDefaultChain()?.toggleItalic().run()}
          active={editor?.isActive('italic')}
        >
          <Icon name="italics_outlined" />
        </ToolbarItem>
        <ToolbarItem
          onClick={() => editorDefaultChain()?.toggleUnderline().run()}
          active={editor?.isActive('underline')}
        >
          <Icon name="underline_outlined" />
        </ToolbarItem>
        <ToolbarItem
          onClick={() => editorDefaultChain()?.toggleStrike().run()}
          active={editor?.isActive('strike')}
        >
          <Icon name="strike_outlined" />
        </ToolbarItem>
      </Group>
    </Toolbar.Root>
  );
};

const Group = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  justify-content: center;
  height: 100%;
  align-items: center;
  border-left: 1px solid ${p => p.theme.gray400};
  max-height: 32px;
  padding-inline: 8px;
  user-select: none;
  transition: border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  &:first-of-type {
    border-left: 0;
  }
`;

const FontText = styled('p', omitProps('fontFamily'))<{
  fontFamily?: string;
}>`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin: 0;
  padding: 0;

  ${p =>
    p.fontFamily !== 'Default' &&
    css`
      font-family: ${p.fontFamily}, sans-serif;
    `};
`;

export const getCurrentActiveFormat = ({
  editor,
}: { editor: Editor | null } & Omit<SVGProps<SVGSVGElement>, 'type'>) => {
  const headingLevel = editor?.getAttributes('heading')?.level;
  const isCodeBlock = editor?.isActive('codeBlock');
  const isParagraph = editor?.isActive('paragraph');
  const isBlockquote = editor?.isActive('blockquote');
  const isBulletList = editor?.isActive('bulletList');
  const isOrderedList = editor?.isActive('orderedList');
  const isLink = editor?.getAttributes('link').href;

  if (isCodeBlock) {
    return 'codeBlock';
  }

  if (isBlockquote) {
    return 'blockquote';
  }

  if (isBulletList) {
    return 'Bullet List';
  }

  if (isOrderedList) {
    return 'Ordered List';
  }

  if (headingLevel) {
    return `h${headingLevel}`;
  }

  if (isLink) {
    return 'link';
  }

  if (isParagraph) {
    return 'p';
  }

  return 'p';
};

export default RichTextToolbar;
