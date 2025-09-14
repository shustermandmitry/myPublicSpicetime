import type { TreeNode } from '@treenity/tree-api';
import type { DataNode } from 'antd/es/tree';
import React, { DragEventHandler } from 'react';

type SettingStateType = 'add' | 'rename' | 'tags' | 'unset';
type SettingStateAction = Omit<SettingStateType, 'unset'>;

export interface IContextMenuHook<T extends ITreeData> {
  settingState: SettingStateType;
  isPaste: boolean;
  item?: T;
  setItem(node?: T): void;
  onCancelState(): void;
  onChangeState(key: SettingStateAction): void;
  onCopy(path: string): void;
  onPaste(): void;
  onRemove(): void;
  onAdd(node: T): void;
  onRename(node: T): void;
  onAddTag(node: T): void;
}

export interface ITreeData extends DataNode {
  path: string;
  treePath: string;
  tags: string[];
  title: string;
  node: TreeNode;
}

export const icons = {
  folder: 'add-folder_outlined',
  project: 'add-square_outlined',
  template: 'template_outlined',
  file: 'file_outlined',
} as const;

export type AssetFolderType = keyof typeof icons;

export interface IFooter {
  title?: string;
  disabled?: boolean;
  type?: AssetFolderType;
}

export interface IFolder {
  disabled?: boolean;
  type?: AssetFolderType;
}

export interface IFooterFolder extends IFooter {
  subtitle?: string;
}

export interface IFolderComponent extends IFolder {
  title: JSX.Element | string;
  image?: JSX.Element | string;
  draggable?: boolean;
  className?: string;
  contextMenu?: JSX.Element;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onSelected?(): void;
  onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  isBorder?: boolean;
  publicLink?: string;
}

export interface IHeaderFolderButtons {
  isSelect: boolean;
  disabled?: boolean;
  onSelect(): void;
}
