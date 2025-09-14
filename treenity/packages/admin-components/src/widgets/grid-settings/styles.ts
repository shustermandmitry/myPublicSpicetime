import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';

export const Buttons = styled.div`
  display: flex;
  gap: 4px;

  &&& > button {
    width: 100% !important;
  }
`;

export const Root = styled('div', omitProps('width'))<{ width?: number }>`
  width: ${p => (p.width ? p.width : '244')}px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
