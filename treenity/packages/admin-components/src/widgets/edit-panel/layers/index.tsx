/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import { IconNamesMap } from '@/components/icon/icon-component/types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC, useCallback, useState } from 'react';
import EditPopover from './EditPopover';
import LayersTree, { LayersItemProps, TreeNode } from './Item';
import titleIconStyle from './style';

export interface ITreeItem {
  title: string;
  icon?: IconNamesMap;
  key: string;
  children?: ITreeItem[];
  props?: TreeNode['props'];
  isHidden?: boolean;
  [key: string]: unknown;
}

interface IChangedName {
  key: string;
  name: string;
}

interface LayersProps extends Omit<LayersItemProps, 'title' | 'onChangeTitle'> {
  data?: ITreeItem[];
  selectedKeys?: string[];
  onRemove?: (key: string) => void;
  onDuplicate?: (key: string) => void;
  onHide?: (key: string, isHidden: boolean) => void;
}

const Key = styled.span`
  font-size: 10px;
  color: ${p => p.theme.gray700};
  font-weight: 400;
`;

export const mockData: ITreeItem[] = [
  {
    title: 'Flex Columns',
    icon: 'flex-columns-container_outlined',
    key: 'fc-001',
    children: [
      {
        title: 'Flex Rows',
        icon: 'flex-rows-container_outlined',
        key: 'fr-001',
        children: [
          {
            title: 'Headline 1',
            icon: 'add-headlines-1_outlined',
            key: 'h1-001',
            children: [
              {
                title: 'Headline 1',
                icon: 'add-headlines-1_outlined',
                key: 'h1-002',
                children: [
                  {
                    title: 'Headline 1',
                    icon: 'add-headlines-1_outlined',
                    key: 'h1-003',
                  },
                  {
                    title: 'Bullet list',
                    icon: 'add-bulleted-list_outlined',
                    key: 'bl-001',
                  },
                  {
                    title: 'Quotes',
                    icon: 'add-quote_outlined',
                    key: 'q-001',
                  },
                ],
              },
              {
                title: 'Bullet list',
                icon: 'add-bulleted-list_outlined',
                key: 'bl-002',
              },
              {
                title: 'Quotes',
                icon: 'add-quote_outlined',
                key: 'q-002',
              },
            ],
          },
          {
            title: 'Bullet list',
            icon: 'add-bulleted-list_outlined',
            key: 'bl-003',
          },
          {
            title: 'Quotes',
            icon: 'add-quote_outlined',
            key: 'q-003',
          },
        ],
      },
      {
        title: 'Flex Rows',
        icon: 'flex-rows-container_outlined',
        key: 'fr-002',
        children: [
          {
            title: 'image',
            icon: 'image_outlined',
            key: 'img-001',
          },
        ],
      },
      {
        title: 'Flex Rows',
        icon: 'flex-rows-container_outlined',
        key: 'fr-003',
        children: [
          {
            title: 'Table',
            icon: 'image_outlined',
            key: 'tbl-001',
          },
        ],
      },
    ],
  },
  {
    title: 'Flex Columns',
    icon: 'flex-columns-container_outlined',
    key: 'fc-002',
    children: [
      {
        title: 'Flex Rows',
        icon: 'flex-rows-container_outlined',
        key: 'fr-004',
        children: [
          {
            title: 'Headline 1',
            icon: 'add-headlines-1_outlined',
            key: 'h1-004',
          },
          {
            title: 'Headline 2',
            icon: 'add-headlines-2_outlined',
            key: 'h2-001',
          },
        ],
      },
    ],
  },
];

/**
 * Layers component for displaying and managing a hierarchical tree structure.
 * @component
 *
 * @param {ITreeItem[]} [props.data=mockData] - The tree data to display
 * @param {Function} [props.onSelect] - Callback function when a tree node is selected
 */
const Layers: FC<LayersProps> = ({
  data = mockData,
  selectedKeys,
  onRemove,
  onDuplicate,
  onHide,
  ...rest
}) => {
  const [title, setTitle] = useState('Hero-container');
  const [changedNames, setChangedNames] = useState<IChangedName[]>([]);

  const handleNameChange = useCallback((key: string, newName: string) => {
    setChangedNames(prevNames => {
      const existingNameIndex = prevNames.findIndex(item => item.key === key);
      if (existingNameIndex !== -1) {
        const newNames = [...prevNames];
        newNames[existingNameIndex] = { key, name: newName };
        return newNames;
      } else {
        return [...prevNames, { key, name: newName }];
      }
    });
  }, []);

  const mapTreeItemsToTreeNodes = (data: ITreeItem[], parentKey: string = '0'): TreeNode[] => {
    return data.map((item, index) => {
      const key = `${parentKey}-${index}`;
      const title = changedNames.find(treeName => treeName.key === key)?.name || item.title;

      const treeNode: TreeNode = {
        title: (
          <TreeContent>
            <TitleTree isHidden={item.isHidden}>
              {/*TODO: CHANGE ICON*/}
              <Icon name="color-picker_filled" />
              <span>{title}</span>
              <EditPopover
                initialValues={title}
                onChange={newName => handleNameChange(key, newName)}
                title="Layer name"
              />
            </TitleTree>
            <Buttons isHidden={item.isHidden}>
              {onDuplicate && (
                <Button
                  type="text"
                  size="x-small"
                  icon="duplicate_outlined"
                  onClick={() => onDuplicate(item.key)}
                />
              )}
              {onHide && (
                <Button
                  type="text"
                  size="x-small"
                  icon={
                    item.isHidden ? <Icon name="eye-off_filled" color="primary" /> : 'eye_outlined'
                  }
                  onClick={() => onHide(item.key, item.isHidden ?? false)}
                />
              )}
              {onRemove && (
                <Button
                  type="text"
                  size="x-small"
                  icon={<Icon name="trash_outlined" color="danger" />}
                  onClick={() => onRemove(item.key)}
                />
              )}
            </Buttons>
          </TreeContent>
        ),
        type: item.title,
        key: item.key,
        props: item.props,
      };

      if (item.children && item.children.length > 0) {
        treeNode.children = mapTreeItemsToTreeNodes(item.children, key);
      }

      return treeNode;
    });
  };

  return (
    <LayersTree
      {...rest}
      title={title}
      onChangeTitle={setTitle}
      treeData={mapTreeItemsToTreeNodes(data, undefined)}
      selectedKeys={selectedKeys}
    />
  );
};

const Buttons = styled('div', omitProps('isHidden'))<{ isHidden?: boolean }>`
  display: flex;

  button {
    &:last-of-type,
    &:first-of-type {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

      ${p =>
        p.isHidden &&
        css`
          opacity: 0.2;
        `};
    }
  }
`;

const TreeContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleTree = styled('span', omitProps('isHidden'))<{ isHidden?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 1;
  transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  ${p =>
    p.isHidden &&
    css`
      opacity: 0.2;
    `};

  & > div:not(.ant-popover) > span > i {
    color: ${p => p.theme.colorPrimary};
  }

  ${titleIconStyle}
  & > i {
    font-size: 12px;
    color: ${p => p.theme.gray700};
  }

  & > div > i {
    font-size: 12px;
    display: block;
    color: ${p => p.theme.colorPrimary};
  }
`;

export default Layers;
