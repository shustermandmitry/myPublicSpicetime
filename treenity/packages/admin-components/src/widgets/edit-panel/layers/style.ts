import { css } from '@emotion/react';

const titleIconStyle = css`
  & > div:not(.ant-popover) {
    display: flex;
    align-items: center;

    & > span > i {
      display: block;
      font-size: 12px;
      transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      opacity: 0;
      cursor: pointer;
    }
  }

  span.open > i,
  &:hover > div > span > i {
    opacity: 1 !important;
  }
`;

export default titleIconStyle;
