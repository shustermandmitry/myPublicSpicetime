import { useLayout } from '@/context/LayoutContext';
import { WithEditorProps } from '@/types';
import { Element } from '@craftjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { HeroSectionProps } from '@treenity/admin-components/elements';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import { withNode } from '../shared/withNode';
import { TestHeroEntity, TestHeroType } from './test-hero.entity';

const Flex = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
`;

const Content = styled(Flex, omitProps('isReversedLayout'))<{
  isReversedLayout?: boolean;
}>`
  padding: 0 64px;

  ${p =>
    p.isReversedLayout &&
    css`
      order: 1;
    `};

  @media (max-width: 800px) {
    padding: 36px;
  }
`;

const HeroRoot = styled('div')<{
  backgroundColor?: string;
}>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  ${p =>
    p.backgroundColor &&
    css`
      background-color: ${(p.theme as any)?.token[p.backgroundColor] || p.backgroundColor};
    `}
`;

export const NodeHeroContent = withNode(
  Content,
  { draggable: true, droppable: true },
  'Hero Content',
);

// This throws an error because of the different reference in editor's resolver.
// const ButtonComponent = () => <WebEditorCell typeId="basic.button" />;
// const RichEditorComponent = () => <WebEditorCell typeId="basic.richEditor" />;
// const Container = () => <WebEditorCell typeId="markup.container" />;

const containerInitialState = {
  styles: {
    layout: {
      display: 'grid',
      grid: {
        column: '400px',
        row: '',
      },
    },
    size: {
      width: 'auto',
      height: 'auto',
      min_width: 'auto',
      max_width: 'none',
      min_height: '400px',
      max_height: 'none',
      overflow: 'visible',
    },
    spacing: {
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
      padding: {
        top: '64px',
        bottom: '64px',
        left: '64px',
        right: '64px',
      },
    },
    background: {
      backgroundColor: '#fafafa',
      backgroundSize: 'auto',
      backgroundImage: undefined,
    },
  },
};

const HeroSection: FC<WithEditorProps<HeroSectionProps, TestHeroEntity>> = ({
  value,
  mergedMeta: { backgroundImage, title, subtitle, text },
}) => {
  const { config } = useLayout();

  const ButtonComponent = config?.components['basic.button'].render!;
  const RichEditorComponent = config?.components['basic.richEditor'].render!;
  const Container = config?.components['markup.container'].render!;

  return (
    <Element is={Container} canvas id="hero-section" initialState={containerInitialState}>
      <Element is={NodeHeroContent} canvas>
        <RichEditorComponent
          initialState={{
            state: `<h3><strong>${subtitle}</strong></h3>`,
          }}
        />
        <RichEditorComponent
          initialState={{
            state: `<h2><strong>${title}</strong></h2>`,
          }}
        />

        <RichEditorComponent
          initialState={{
            state: `<p><span style=\"font-size: 14px\">${text}</span></p>`,
          }}
        />

        <ButtonComponent>Get Started Hero</ButtonComponent>
      </Element>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
    </Element>
  );
};
HeroSection.displayName = 'Hero Section';

export { default as schema } from './test-hero.entity.schema.json';
export { TestHeroEntity as Entity, TestHeroType as EntityType, HeroSection as Render };
