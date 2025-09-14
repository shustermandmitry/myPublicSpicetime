import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ShowAfterTimeout } from '@/components/ShowAfterTimeout';
import { useRenderContext } from '@/context/RenderContext';
import { useSwrSync } from '@/hooks/useSwrSync';
import { IReactContextProps, Meta, Node, ReactTypeContextInfo, types } from '@treenity/core';
import { FC, PropsWithChildren } from 'react';

export type TFC<T, P = {}, N extends Node = Node> = FC<IReactContextProps<T, P, N>>;

export type TFCC<T, P = {}, N extends Node = Node> = FC<
  PropsWithChildren<IReactContextProps<T, P, N>>
>;

export interface RenderURLProps {
  url: string;
  children?: any;

  loading?: () => JSX.Element;
  loader?: (props: RenderURLProps) => ReactTypeContextInfo | Promise<ReactTypeContextInfo>;

  [more: string]: any;
}

let Render = function Render(props: RenderURLProps) {
  const ctx = useRenderContext();
  const { data: componentInfo, error } = useSwrSync<ReactTypeContextInfo>(
    `render_${props.context ?? ctx}_${props.url}`,
    () =>
      props.loader ? props.loader(props) : types.react.getInfo(props.context ?? ctx, props.url),
    props.swr,
  );

  const { url, fallback, render, loading, loaderHook, value, ...other } = props;

  if (!props.swr?.suspense) {
    if (!value) {
      return <>Loading ...</>;
    }
  }

  if (!componentInfo) {
    if (fallback !== undefined) return fallback(props);
    return error ? (
      `not found ${url}`
    ) : (
      <ShowAfterTimeout timeout={200}>Loading...</ShowAfterTimeout>
    );
  }

  let {
    component: Component,
    options: { props: componentProps },
  } = componentInfo;

  const allProps = { ...componentProps, ...other, value, url };

  // @ts-ignore
  const result = <Component {...allProps} />;

  return render ? render(result, allProps) : result;
};

if (process.env.NODE_ENV !== 'production') {
  const RenderOrig = Render;
  Render = (props: RenderURLProps) => <ErrorBoundary>{RenderOrig(props)}</ErrorBoundary>;
}

export { Render };

export const render = (url: string, defProps: any) => (props: any) =>
  Render({ url, ...defProps, ...props });

interface IRenderMetaProps extends Omit<RenderURLProps, 'url'> {
  value: Meta;
  // node: NodeLoader;
  context?: string;
}

export const RenderMeta = ({ value, node, ...props }: IRenderMetaProps) => {
  if (!value) {
    return null;
  }
  return Render({ ...props, url: value.$.type.$type, value, node });
};

interface IRenderType extends Omit<RenderURLProps, 'url'> {
  type: Meta;
  metaName?: string;
}

export const RenderType = ({ node, type, metaName, swr, ...props }: IRenderType) => {
  let { data: value } = useSwrSync(
    `render_type_${node?.path}_${type.$type}_${metaName || ''}`,
    async () => {
      const meta = await node.get(type, metaName);
      return meta;
    },
    swr ? swr : { revalidate: false },
  );

  let url = type.$type;

  // if (!value) {
  //   return <>Loading...</>;
  // }

  return <Render {...props} url={url} node={node} value={value} swr={swr} />;
};
