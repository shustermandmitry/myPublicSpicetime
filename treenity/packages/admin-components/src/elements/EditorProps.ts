import { type Node } from '@treenity/core';
import { Entity } from '@treenity/entity';
import { CSSProperties, FC } from 'react';
// type EditorProps<T, K, N extends Node, P> = {
//   mergedMeta: P;
// } & TFC<T, K, N>;

type LinkItem = { link: string; [key: string]: any };
export type ConvertUrlApi = {
  string: (path: string) => string;
  object: <T extends LinkItem>(value: T) => T;
  array: <T extends LinkItem>(menu: Array<T>) => Array<T>;
};

export type EditorProps<T> = FC<{
  mergedMeta: T;
  value: Entity<T>;
  node: Node;
  convertUrl: ConvertUrlApi;
  style: CSSProperties;
}>;
