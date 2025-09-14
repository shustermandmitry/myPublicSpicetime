/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';

const StyledSiderTree = styled('div', omitProps('collapsed'))<{ collapsed?: boolean }>`
  margin-bottom: 4px;
  overflow: hidden auto;
  transition: padding 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 100%;
  }

  & {
    scrollbar-color: ${p => p.theme.colorPrimary} ${p => p.theme.gray400};
    scrollbar-width: thin;
  }

  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected,
  .ant-tree .ant-tree-checkbox + span.ant-tree-node-selected,
  .ant-tree .ant-tree-node-content-wrapper:hover,
  .ant-tree .ant-tree-checkbox + span:hover,
  .ant-tree .ant-tree-switcher:not(.ant-tree-switcher-noop):hover {
    background-color: transparent;
  }

  .ant-tree .ant-tree-node-content-wrapper .ant-tree-iconEle,
  .ant-tree .ant-tree-checkbox + span .ant-tree-iconEle {
    display: none;
  }

  .ant-tree-list-holder-inner > div {
    flex: 1;
    width: 100%;

    .ant-tree-node-content-wrapper {
      flex: 1;
      min-width: 0;

      .ant-tree-title {
        display: block;
      }
    }
  }

  .ant-tree-show-line .ant-tree-indent-unit-end:before {
    display: block;
  }

  .ant-tree .ant-tree-treenode-leaf-last .ant-tree-switcher-leaf-line:before {
    top: 0 !important;
    bottom: -4px !important;
    height: auto !important;
  }

  .ant-tree .ant-tree-switcher.ant-tree-switcher-noop,
  .ant-tree-switcher-leaf-line,
  .ant-tree-indent-unit {
    width: 24px !important;

    &:after {
      display: none;
    }

    &:before {
      inset-inline-end: 12px;
    }
  }

  .ant-tree .ant-tree-switcher.ant-tree-switcher_open,
  .ant-tree .ant-tree-switcher.ant-tree-switcher_close {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 1;
  }

  ${p =>
    p.collapsed
      ? css`
          padding: 0 0 0 12px;
        `
      : css`
          padding: 0 0 0 24px;
        `};
`;

export default StyledSiderTree;
