// @ts-nocheck
import { WebEditorEntity } from '@/components/Editor/webeditor.entity';
import convertUrl, { ConvertUrlApi } from '@/utils/convert-url';
import { WebEditorConfig } from '@/utils/generate-editor-config';

import type { Node } from '@treenity/core';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

export interface IRedirectOptions {
  url: string;
  replaceKey: string;
}

type LayoutContextType = {
  config: WebEditorConfig | undefined;
  node: Node;
  layout: WebEditorEntity;
  suspense?: boolean;
  convertUrl: ConvertUrlApi;
};

type LayoutContextValue = Omit<LayoutContextType, 'convertUrl'> & {
  redirectOptions?: IRedirectOptions;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: FC<
  PropsWithChildren<{
    value: LayoutContextValue;
  }>
> = ({ children, value }) => {
  value.convertUrl = convertUrl(value.redirectOptions);
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
