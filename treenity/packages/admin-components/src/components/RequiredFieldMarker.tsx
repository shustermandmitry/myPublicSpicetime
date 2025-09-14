import { css } from '@emotion/react';

const RequiredFieldMarker =
  (top: number = 4, right: number = 4) =>
  (p: any) => css`
    ${p['aria-required'] &&
    css`
      &::after {
        content: '*';
        color: ${p.theme.colorError};
        position: absolute;
        right: ${right}px;
        top: ${top}px;
        font-size: 20px;
        z-index: 1;
      }
    `}
  `;

export default RequiredFieldMarker;
