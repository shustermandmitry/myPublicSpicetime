import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import { IFooterFolder } from '../types';
import { Title } from './folderTitle';

const FooterProject: FC<IFooterFolder> = ({ title, subtitle }) => {
  return (
    <Root>
      {title && (
        <Title data-testid="folder-name" size="sm">
          {title}
        </Title>
      )}
      {subtitle && <Subtitle size="xs">{subtitle}</Subtitle>}
    </Root>
  );
};

const Subtitle = styled(TextContent)`
  margin-top: 0;
  font-weight: 500;
  margin-bottom: 0;
`;

const Root = styled('div', omitProps('disabled'))<{ disabled?: boolean }>`
  ${p =>
    p.disabled &&
    css`
      opacity: 0.4;
    `}

  border-top: 1px solid rgba(167, 162, 189, 0.15);
  height: 34px;
  padding: 0 18px;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

export default FooterProject;
