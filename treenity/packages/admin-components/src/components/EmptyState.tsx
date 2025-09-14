import styled from '@emotion/styled';
import { FC, PropsWithChildren } from 'react';

const EmptyState: FC<PropsWithChildren<{ title: string; subtitle?: string }>> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Root>
      <Image src="/svg/empty-image.svg" alt="empty-image" />
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </Root>
  );
};

const Image = styled.img`
  display: block;
  width: 72px;
  margin-bottom: 2px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.32px;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: -0.24px;
  margin-top: 0;
  margin-bottom: 8px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default EmptyState;
