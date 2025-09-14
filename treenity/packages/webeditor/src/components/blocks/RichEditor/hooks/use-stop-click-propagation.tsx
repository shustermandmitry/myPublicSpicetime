import { useEffect } from 'react';

export const useStopClickPropagation = (id: string) => {
  useEffect(() => {
    const stopPropagation = (e: Event) => e.stopPropagation();
    const editorElement = document.querySelector(
      `[data-rfd-draggable-id="draggable-${id}"] div.editor`,
    );
    if (!editorElement) return;
    editorElement.addEventListener('mousedown', stopPropagation);
    return () => editorElement.removeEventListener('mousedown', stopPropagation);
  }, [id]);
};
