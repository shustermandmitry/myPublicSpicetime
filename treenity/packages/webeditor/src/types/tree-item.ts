import type { TreeDataNode } from 'antd';

export type ITreeItem = Pick<TreeDataNode, 'key'> & {
  index: number;
  key: string;
  zoneKey: string;
  path: string;
  children: ITreeItem[];
  props?: {
    id: string;
    [key: string]: any;
  };
  title: string;
};
