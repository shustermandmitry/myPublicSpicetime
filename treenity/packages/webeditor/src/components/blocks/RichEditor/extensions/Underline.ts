import { Mark, mergeAttributes } from '@tiptap/core';

export const Underline = Mark.create({
  name: 'underline',
//@ts-ignore
  parseHTML() {
    return [
      {
        tag: 'u',
      },
      {
        style: 'text-decoration',
        getAttrs: (value: string) => (value === 'underline' ? null : false),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['u', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleUnderline:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});
