import Icon from '@/components/icon';
import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import { AssetFolderType, icons, IFolder } from './types';

const FolderEmpty: FC<IFolder> = ({ type = 'folder', disabled }) => {
  return (
    <Root disabled={disabled} type={type}>
      {icons[type] && <IconStyled name={icons[type]} color="gray" />}
      <Title size="sm" disabled={disabled}>
        Add {type}
      </Title>
    </Root>
  );
};
const Root = styled('div', omitProps('disabled', 'type'))<{
  disabled?: boolean;
  type: AssetFolderType;
}>`
  border: 2px dashed rgba(167, 162, 189, 0.5);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  cursor: pointer;

  ${p =>
    p.disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          opacity: 1;
        `}
  ${p => css`
    ${p.type === 'folder' &&
    css`
      height: 142px;
    `}
    ${p.type === 'template' &&
    css`
      height: 208px;
    `}
    ${p.type === 'project' &&
    css`
      height: 166px;
    `}
  `}
`;

const Title = styled(TextContent, omitProps('disabled'))<{ disabled?: boolean }>`
  transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  opacity: 0.7;
  margin-bottom: 0;
  ${p =>
    !p.disabled &&
    css`
      opacity: 0.5;
    `}
`;

const IconStyled = styled(Icon)`
  margin-bottom: 12px;

  i {
    font-size: 45px;
  }
`;

export default FolderEmpty;
