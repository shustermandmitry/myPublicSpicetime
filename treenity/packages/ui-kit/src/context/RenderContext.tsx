import { createContext, ReactNode, useContext } from 'react';

const RENDER_CONTEXT = {
  DEFAULT: '',
  EDIT: 'edit',
  RENDER: 'render',
  WIDGET: 'widget',
} as const;

type RenderContextType = (typeof RENDER_CONTEXT)[keyof typeof RENDER_CONTEXT];

const RenderContext = createContext<RenderContextType>(RENDER_CONTEXT.DEFAULT);

const RenderContextProvider: React.FC<{ children: ReactNode; value: RenderContextType }> = ({
  children,
  value,
}) => {
  return <RenderContext.Provider value={value}>{children}</RenderContext.Provider>;
};

const useRenderContext = (): string => {
  const context = useContext(RenderContext);

  // TODO: should we throw an error if the context is not set? or just use default context.
  // if (!context) {
  //   throw new Error(`useRenderContext must be used within an RenderProvider`);
  // }

  return context;
};

export { RENDER_CONTEXT, RenderContextProvider, useRenderContext };
export type { RenderContextType };
