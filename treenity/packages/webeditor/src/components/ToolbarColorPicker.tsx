import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
// @ts-ignore
import { Editor } from '@tiptap/core/src/Editor';
import { ColorPicker } from 'antd';
import { generateColor } from 'antd/lib/color-picker/util.js';
import React, { FC, useCallback } from 'react';

function toHex(string: string) {
  return generateColor(string).toHexString();
}

interface ToolbarColorPickerProps {
  editor: Editor;
  isAnythingSelected: (editor: Editor) => boolean;
}

const ToolbarColorPicker: FC<ToolbarColorPickerProps> = ({ editor, isAnythingSelected }) => {
  const theme = useTheme();
  const getPopupContainer = useCallback(() => document.body, []);

  return (
    <ColorPickerStyled
      trigger="click"
      getPopupContainer={getPopupContainer}
      value={toHex(editor?.getAttributes('textStyle')?.color || theme.colorTextBase)}
      onChangeComplete={e => {
        editor
          ?.chain()
          .focus()
          ?.[isAnythingSelected(editor) ? 'focus' : 'selectAll']()
          .setColor(e.toHexString())
          .run();
      }}
    />
  );
};

const ColorPickerStyled = styled(ColorPicker)`
  &&& {
    border: 0;
    box-shadow: none;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 28px;
    min-height: 28px;
    padding-inline: 0;
    transition: background-color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
`;

export default ToolbarColorPicker;
