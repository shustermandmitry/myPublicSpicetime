import type { WithEditorProps } from '@/types';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Frame, useNode, UserComponent } from '@craftjs/core';
import { FC, forwardRef, PropsWithChildren } from 'react';
import dropZoneFixStyles from '../shared/dropZoneFix.styles';
import { resolvePixelValue } from '@/utils/resolve-pixel-value';
import type { CardProps, CardWidth, CardItem } from './types';
import { CardEntity } from './card.entity';
import { withNode } from '../shared/withNode';

const CardRoot = styled('div', omitProps('width', 'elevation', 'styles'))<
  Omit<CardProps, 'renderItem' | 'styles'>
>`
  box-shadow: ${({ elevation }) => getElevation(elevation)};
  width: ${({ width }) => getWidth(width)};
  display: flex;
  gap: 10px;
  padding: 1rem;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin: 16px;
  background-color: #fafafa;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
    background-color: #ffffff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }
`;

const CardHeader = styled.div`
  padding: ${resolvePixelValue(16)};
`;

const CardContent = styled.div`
  flex: 1;
  padding: ${resolvePixelValue(16)};
`;

const CardFooter = styled.div`
  padding: ${resolvePixelValue(16)};
`;

// @ts-ignore
export const CardTop: UserComponent<PropsWithChildren> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <Frame>
      <button>asdasdasd</button>
      {children}
    </Frame>
    // <div
    //   ref={connect}
    //   className="text-only"
    //   style={{
    //     padding: '10px',
    //     marginBottom: '10px',
    //     borderBottom: '1px solid #eee',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'flex-start',
    //   }}
    // >
    //   {children}
    // </div>
  );
};

CardTop.craft = {
  displayName: 'Card Top',
  rules: {
    canMoveIn: () => true,
  },
};

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={className} {...props} />
);

export const NodeCardTitle = withNode(CardTitle, { draggable: true, droppable: true });

CardTitle.displayName = 'CardTitle';

export const Card: FC<PropsWithChildren<WithEditorProps<CardProps, CardEntity>>> = ({
  style,
  children,
  renderItem,
  ...props
}) => {
  return (
    <div style={{ background: '#cbd5e1', padding: '40px' }}>
      <button>kk</button>
      {/* <NodeCardTitle>Card Title</NodeCardTitle>
      <Element canvas id="card-top" is={CardTop}></Element> */}
    </div>
  );
};

function getWidth(width: CardWidth) {
  switch (width) {
    case 'auto':
      return 'auto';
    case '100%':
      return '100%';
    case 'min':
      return 'min-content';
    case 'max':
      return 'max-content';
  }
}

function getElevation(elevation: CardProps['elevation']) {
  switch (elevation) {
    case 'low':
      return '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    case 'medium':
      return '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)';
    case 'high':
      return '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
  }
}
