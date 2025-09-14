import { TextStyle } from '@tiptap/extension-text-style';

export const LineHeight = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      lineHeight: {
        default: null,
        parseHTML: element => element.style.lineHeight,
        renderHTML: attributes => {
          if (!attributes.lineHeight) {
            return {};
          }
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { lineHeight }).run();
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { lineHeight: null }).run();
        },
    };
  },
});
