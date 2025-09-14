import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';


export const useFocusOnSelect = (isSelected: boolean, editor?: Editor | null) => {
  useEffect(() => {
    if (!editor) return;
    if (isSelected) {
      editor.setEditable(true);
      editor.commands.focus();
      return;
    }
    editor.setEditable(false);
    window.getSelection()?.removeAllRanges();
  }, [isSelected, editor]);

  return null;
};
