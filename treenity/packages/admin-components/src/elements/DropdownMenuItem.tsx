import styled from '@emotion/styled';
import { TextContent } from '@/components/typography';
import type { FC } from 'react';

interface ProfileMenuItemProps {
  title: string;
  subtitle?: string;
}

const DropdownMenuItem: FC<ProfileMenuItemProps> = ({ title, subtitle }) => (
  <WalletMenuItem>
    <Title size={10} fontWeight={700} letterSpacing={-0.2} lineHeight={1.4}>
      {title}
    </Title>
    {subtitle && <Value>{subtitle}</Value>}
  </WalletMenuItem>
);

const Title = styled(TextContent)`
  margin: 0;
`;

const Value = styled(TextContent)`
  margin: 0;
`;

const WalletMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default DropdownMenuItem;
