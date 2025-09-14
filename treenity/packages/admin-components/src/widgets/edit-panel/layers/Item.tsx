/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import styled from '@emotion/styled';
import type { TreeDataNode } from 'antd';
import { Tree } from 'antd';
import { AntTreeNodeProps, TreeProps } from 'antd/es/tree';
import { FC } from 'react';
import EditPopover from './EditPopover';
import titleIconStyle from './style';

export interface TreeNode extends TreeDataNode {
  type: string;
  props?: {
    id: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface LayersItemProps extends TreeProps<TreeNode> {
  title: string;
  onChangeTitle(value: string): void;
  selectedKeys?: string[];
}

const LayersTree: FC<LayersItemProps> = ({
  title,
  onChangeTitle,
  treeData,
  onSelect,
  selectedKeys,
  ...rest
}) => {
  return (
    <Root>
      <Title>
        <p>{title}</p>
        <EditPopover title="Section name" initialValues={title} onChange={onChangeTitle} />
      </Title>
      <TreeStyle
        {...rest}
        defaultExpandAll
        selectedKeys={selectedKeys}
        showLine={{ showLeafIcon: true }}
        showIcon
        onSelect={onSelect}
        treeData={treeData}
        switcherIcon={(props: AntTreeNodeProps) => (
          <ArrowIcon
            name="arrow-bottom_outlined"
            rotate={props.expanded ? 180 : 0}
            color="primary"
          />
        )}
      />
    </Root>
  );
};

const ArrowIcon = styled(Icon)`
  i {
    display: block;
  }
`;

const TreeStyle = styled(Tree<TreeNode>)`
  .ant-tree-list-holder-inner {
    & > div,
    .ant-tree-treenode {
      --background-color: ${p => p.theme.colorBgContainer};
      --border-color: ${p => p.theme.gray400};
      --border-hover-color: ${p => p.theme.gray700};
      height: 22px;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 4px;
      padding-bottom: 0;
      border-radius: 0;

      & > .ant-tree-node-content-wrapper > span > div > div {
        transition: opacity 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
        opacity: 0;
      }

      &:hover:has(> span.ant-tree-switcher:hover),
      &:hover:has(> span.ant-tree-node-content-wrapper:hover) {
        & > .ant-tree-node-content-wrapper > span > div > div {
          opacity: 1;
        }

        span.ant-tree-node-content-wrapper,
        span.ant-tree-switcher {
          border-color: var(--border-hover-color);
        }
      }

      &.ant-tree-treenode-selected {
        --border-color: ${p => p.theme.colorPrimary};

        .ant-tree-title {
          color: ${p => p.theme.colorPrimary};
        }
      }

      .ant-tree-switcher {
        width: 18px;

        &:before {
          display: none;
        }

        &.ant-tree-switcher-noop {
          display: none;
        }

        align-items: center;
        display: flex;
        justify-content: space-around;
      }

      .ant-tree-indent-unit:before {
        display: inline-block !important;
      }

      .ant-tree-indent-unit:before {
        top: -4px;
      }

      &.ant-tree-treenode-leaf-last:last-of-type {
        .ant-tree-indent-unit:before {
          bottom: 0;
        }
      }

      .ant-tree-indent-unit {
        width: 13px;

        &:before {
          inset-inline-end: 6px;
        }
      }

      .ant-tree-switcher.ant-tree-switcher_open + .ant-tree-node-content-wrapper,
      .ant-tree-switcher.ant-tree-switcher_close + .ant-tree-node-content-wrapper {
        padding-left: 0;
      }

      .ant-tree-node-content-wrapper {
        height: 22px;
        line-height: 20px;
        min-height: 22px;
        flex: 1;
        background-color: transparent;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        background: var(--background-color);
        padding: 0 4px;
        transition:
          background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
          border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

        &.ant-tree-node-content-wrapper-open,
        &.ant-tree-node-content-wrapper-close {
          border-left: none;
          border-radius: 0 4px 4px 0;
        }

        .ant-tree-title {
          font-size: 10px;
          font-weight: 800;
          line-height: 20px;
          letter-spacing: -0.2px;
          display: block;
        }
      }

      .ant-tree-switcher.ant-tree-switcher_open,
      .ant-tree-switcher.ant-tree-switcher_close {
        margin-inline-end: 0;
        background-color: transparent;
        line-height: 20px;
        border-radius: 4px 0 0 4px;
        border: 1px solid var(--border-color);
        background: var(--background-color);
        border-right: 0;
        transition:
          background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
          border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      }
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 8px;

  & > div:not(.ant-popover) > span > i {
    color: ${p => p.theme.colorPrimary};
  }

  ${titleIconStyle};

  p {
    font-size: 12px;
    font-weight: 800;
    line-height: 12px;
    letter-spacing: -0.48px;
    margin: 0;
  }
`;

const Root = styled.div`
  padding: 12px;
`;

export default LayersTree;
