import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import { IFooter } from '../types';
import { Title } from './folderTitle';

const FooterFolder: FC<IFooter> = ({ title, disabled, type }) => {
  const name = type === 'folder' ? 'folder_outlined' : 'file_outlined';

  return (
    <Root disabled={disabled}>
      <Icon name={name} />
      {title && (
        <Title data-testid="folder-name" size="xs" lineHeight={1.3} fontWeight={600}>
          {title}
        </Title>
      )}
    </Root>
  );
};

const Root = styled('div', omitProps('disabled'))<{ disabled?: boolean }>`
  padding: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
  color: ${p => p.theme.colorPrimary};

  ${p =>
    p.disabled &&
    css`
      opacity: 0.4;
    `}
`;

export default FooterFolder;
