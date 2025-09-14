import { AICodeGenerator } from '@/components/blocks/CodeComponent/AICodeGenerator';
import { CodeComponentEntity } from '@/components/blocks/CodeComponent/CodeComponent.entity';
import { Switch, TextContent } from '@treenity/admin-components/components';
import { TFC, Render as TRender } from '@treenity/ui-kit';
import { FC, useState } from 'react';

import { Tabs } from 'antd';
import Chat from './chat';
import type { CodeComponentProps } from './types';

import { aiChatStore } from '@/store/ai-chat';
import styled from '@emotion/styled';
import { codeComponentLoader } from './loader';
import { Entity } from '@treenity/entity';

export const Edit: TFC<
  Entity<CodeComponentEntity>,
  { mergedMeta: Partial<CodeComponentProps>; id: string }
> = ({ mergedMeta, value, id }) => {
  const [showComponent, setShowComponent] = useState(false);
  const isLoading = aiChatStore.isLoading(id);

  if (mergedMeta.expert) {
    return (
      <>
        <Tabs>
          <Tabs.TabPane key="1" tab="Code">
            <AICodeGenerator value={value} mergedMeta={mergedMeta} />
            <TRender
              value="DONT_REMOVE"
              {...mergedMeta.gen}
              key={value.code}
              url={id}
              code={value.code}
              id={id}
              loader={codeComponentLoader}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Preview" destroyInactiveTabPane>
            {/* Not rendering without value prop, keep for now */}
            <TRender
              value="DONT_REMOVE"
              {...mergedMeta.gen}
              key={value.code}
              url={id}
              code={value.code}
              id={id}
              loader={codeComponentLoader}
            />
          </Tabs.TabPane>
        </Tabs>
      </>
    );
  }

  if (mergedMeta.ready) {
    return (
      <TRender
        value="DONT_REMOVE"
        {...mergedMeta.gen}
        key={value.code}
        url={id}
        code={value.code}
        id={id}
        loader={codeComponentLoader}
      />
    );
  }

  return (
    <>
      <SwitchWrapper>
        <Switch
          disabled={isLoading}
          size="small"
          value={showComponent}
          onChange={setShowComponent}
        />
        <TextContent>Preview</TextContent>
      </SwitchWrapper>
      {showComponent ? (
        <TRender
          value="DONT_REMOVE"
          {...mergedMeta.gen}
          key={value.code}
          url={id}
          code={value.code}
          id={id}
          loader={codeComponentLoader}
        />
      ) : (
        <Root>
          <Chat entity={value} history={mergedMeta.ai?.messages || []} />
        </Root>
      )}
    </>
  );
};

const SwitchWrapper = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
  top: 4px;
  right: 16px;
  gap: 4px;
`;

const Root = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;
