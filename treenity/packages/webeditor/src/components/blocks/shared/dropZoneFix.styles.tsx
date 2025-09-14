import { css } from '@emotion/react';

export default css`
  /* &:not(:has([class*='_DropZone--userIsDragging_'])) { */
  /* [data-rfd-draggable-id], */
  /* [class*='_DraggableComponent-contents_'], */
  /* [class*='_DropZone'] {
    height: 100%;
  } */
  /* } */

  /* [class*='_DraggableComponent-contents_'] > div {
    height: 100%;
  } */

  /* [data-rfd-draggable-id]:has([class*='container']) {
    height: 100%;

    [class*='_DropZone'] {
      height: 100%;
    }

    [class*='_DraggableComponent-contents_'] > div {
      height: 100%;
    }
  } */

  [class*='_DropZone--hasChildren_'] > div {
    min-height: auto;
    /* min-height: 128px; */
  }

  /* [class*='_DropZone--userIsDragging_'] > div {
    min-height: 128px;
  }  */
`;
