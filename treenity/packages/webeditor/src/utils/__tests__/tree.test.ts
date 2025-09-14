import { constructTree } from '@/utils/tree';
import type { SerializedNodes } from '@craftjs/core';

describe('constructTree', () => {
  const sampleData: SerializedNodes = {
    ROOT: {
      type: { resolvedName: 'root' },
      isCanvas: true,
      props: {},
      displayName: 'Root',
      custom: {},
      parent: null,
      nodes: ['compA', 'compB'],
      linkedNodes: {},
      hidden: false,
    },
    compA: {
      type: { resolvedName: 'ComponentA' },
      isCanvas: true,
      props: { id: 'compA' },
      displayName: 'ComponentA',
      custom: {},
      parent: 'ROOT',
      nodes: ['compA1'],
      linkedNodes: {},
      hidden: false,
    },
    compB: {
      type: { resolvedName: 'ComponentB' },
      isCanvas: true,
      props: { id: 'compB' },
      displayName: 'ComponentB',
      custom: {},
      parent: 'ROOT',
      nodes: ['compB1', 'compB2'],
      linkedNodes: {},
      hidden: false,
    },
    compA1: {
      type: { resolvedName: 'ComponentA1' },
      isCanvas: false,
      props: { id: 'compA1' },
      displayName: 'ComponentA1',
      custom: {},
      parent: 'compA',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    compB1: {
      type: { resolvedName: 'ComponentB1' },
      isCanvas: false,
      props: { id: 'compB1' },
      displayName: 'ComponentB1',
      custom: {},
      parent: 'compB',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    compB2: {
      type: { resolvedName: 'ComponentB2' },
      isCanvas: false,
      props: { id: 'compB2' },
      displayName: 'ComponentB2',
      custom: {},
      parent: 'compB',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
  };

  const sampleDataWithLinkedNodes: SerializedNodes = {
    ROOT: {
      type: { resolvedName: 'root' },
      isCanvas: true,
      props: {},
      displayName: 'Root',
      custom: {},
      parent: null,
      nodes: ['compA', 'compB'],
      linkedNodes: {
        header: 'headerComp',
        footer: 'footerComp',
      },
      hidden: false,
    },
    headerComp: {
      type: { resolvedName: 'Header' },
      isCanvas: false,
      props: { id: 'header' },
      displayName: 'Header',
      custom: {},
      parent: 'ROOT',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    footerComp: {
      type: { resolvedName: 'Footer' },
      isCanvas: false,
      props: { id: 'footer' },
      displayName: 'Footer',
      custom: {},
      parent: 'ROOT',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    compA: {
      type: { resolvedName: 'ComponentA' },
      isCanvas: true,
      props: { id: 'compA' },
      displayName: 'ComponentA',
      custom: {},
      parent: 'ROOT',
      nodes: ['compA1'],
      linkedNodes: {},
      hidden: false,
    },
    compB: {
      type: { resolvedName: 'ComponentB' },
      isCanvas: true,
      props: { id: 'compB' },
      displayName: 'ComponentB',
      custom: {},
      parent: 'ROOT',
      nodes: ['compB1', 'compB2'],
      linkedNodes: {},
      hidden: false,
    },
    compA1: {
      type: { resolvedName: 'ComponentA1' },
      isCanvas: false,
      props: { id: 'compA1' },
      displayName: 'ComponentA1',
      custom: {},
      parent: 'compA',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    compB1: {
      type: { resolvedName: 'ComponentB1' },
      isCanvas: false,
      props: { id: 'compB1' },
      displayName: 'ComponentB1',
      custom: {},
      parent: 'compB',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
    compB2: {
      type: { resolvedName: 'ComponentB2' },
      isCanvas: false,
      props: { id: 'compB2' },
      displayName: 'ComponentB2',
      custom: {},
      parent: 'compB',
      nodes: [],
      linkedNodes: {},
      hidden: false,
    },
  };

  it('constructs a tree structure from Craft.js data', () => {
    const result = constructTree(sampleData);

    expect(result).toEqual([
      {
        index: 0,
        zoneKey: 'ROOT',
        title: 'root',
        props: {},
        key: 'ROOT',
        path: '0',
        children: [
          {
            index: 0,
            zoneKey: 'ROOT',
            title: 'ComponentA',
            props: { id: 'compA' },
            key: 'compA',
            path: '0-0',
            children: [
              {
                index: 0,
                zoneKey: 'compA',
                title: 'ComponentA1',
                props: { id: 'compA1' },
                key: 'compA1',
                path: '0-0-0',
                children: [],
              },
            ],
          },
          {
            index: 1,
            zoneKey: 'ROOT',
            title: 'ComponentB',
            props: { id: 'compB' },
            key: 'compB',
            path: '0-1',
            children: [
              {
                index: 0,
                zoneKey: 'compB',
                title: 'ComponentB1',
                props: { id: 'compB1' },
                key: 'compB1',
                path: '0-1-0',
                children: [],
              },
              {
                index: 1,
                zoneKey: 'compB',
                title: 'ComponentB2',
                props: { id: 'compB2' },
                key: 'compB2',
                path: '0-1-1',
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('handles empty nodes', () => {
    const emptyData: SerializedNodes = {
      ROOT: {
        type: { resolvedName: 'root' },
        isCanvas: true,
        props: {},
        displayName: 'Root',
        custom: {},
        parent: null,
        nodes: [],
        linkedNodes: {},
        hidden: false,
      },
    };

    const result = constructTree(emptyData);

    expect(result).toEqual([
      {
        index: 0,
        zoneKey: 'ROOT',
        title: 'root',
        props: {},
        key: 'ROOT',
        path: '0',
        children: [],
      },
    ]);
  });

  it('handles linked nodes as children', () => {
    const result = constructTree(sampleDataWithLinkedNodes);

    // Check total number of children (2 regular + 2 linked nodes)
    expect(result[0].children).toHaveLength(4);

    // Check regular nodes are first
    expect(result[0].children[0]).toEqual({
      index: 0,
      zoneKey: 'ROOT',
      title: 'ComponentA',
      props: { id: 'compA' },
      key: 'compA',
      path: '0-0',
      children: [
        {
          index: 0,
          zoneKey: 'compA',
          title: 'ComponentA1',
          props: { id: 'compA1' },
          key: 'compA1',
          path: '0-0-0',
          children: [],
        },
      ],
    });

    expect(result[0].children[1]).toEqual({
      index: 1,
      zoneKey: 'ROOT',
      title: 'ComponentB',
      props: { id: 'compB' },
      key: 'compB',
      path: '0-1',
      children: [
        {
          index: 0,
          zoneKey: 'compB',
          title: 'ComponentB1',
          props: { id: 'compB1' },
          key: 'compB1',
          path: '0-1-0',
          children: [],
        },
        {
          index: 1,
          zoneKey: 'compB',
          title: 'ComponentB2',
          props: { id: 'compB2' },
          key: 'compB2',
          path: '0-1-1',
          children: [],
        },
      ],
    });

    // Check linked nodes are appended after regular nodes
    expect(result[0].children[2]).toEqual({
      index: 2,
      zoneKey: 'ROOT',
      title: 'Header',
      props: { id: 'header' },
      key: 'headerComp',
      path: '0-2',
      children: [],
    });

    expect(result[0].children[3]).toEqual({
      index: 3,
      zoneKey: 'ROOT',
      title: 'Footer',
      props: { id: 'footer' },
      key: 'footerComp',
      path: '0-3',
      children: [],
    });

    // Verify the order matches the linkedNodes object
    const linkedNodesOrder = Object.keys(sampleDataWithLinkedNodes.ROOT.linkedNodes);
    expect(result[0].children[2].key).toBe(
      sampleDataWithLinkedNodes.ROOT.linkedNodes[linkedNodesOrder[0]],
    );
    expect(result[0].children[3].key).toBe(
      sampleDataWithLinkedNodes.ROOT.linkedNodes[linkedNodesOrder[1]],
    );
  });
});
