import { Radio } from 'antd';
import React, { useState } from 'react';
import ReactFlow, { Controls, MiniMap } from 'react-flow-renderer';
import { useCurrentNode } from '../../../tree/base/CurrentNodeContext';
import { useInputState } from '../../../ui/utils/useInputState';
import useTracker from '../../../ui/utils/useTracker';
import { NamedNode } from '../../types/named-node/NamedNode.meta';
import { TelegramActionIfElse } from '../actions/if-else/TelegramActionIfElse.meta';
import { TelegramActionMenu } from '../actions/menu/TelegramActionMenu.meta';
import { TelegramAction } from '../actions/TelegramAction.meta';

const dagre = require('dagre');

const style = { height: 600, userSelect: 'none' };

const PageGraph = ({ node }) => {
  const [, setCurrent] = useCurrentNode();
  const [selected, setSelected] = useState<any>(null);
  const [layoutType, setLayoutType] = useInputState('network-simplex');

  const { elements } = useTracker(() => {
    const pageNodes = node.findAllChildren({ '_m._t': 'tg.page' });
    if (node.getMeta('tg.page')) pageNodes.push(node);

    const edges = [];
    const edgeSet = {};
    const nodeSet = {};

    const addNode = (pageNode, recursive = true) => {
      const id = pageNode._id;
      const addEdge = (a, label = '') => {
        if (!a) return;
        if (a._t === 'tg.action.page') {
          const edgeId = `${id}-${a.nodeId}`;
          const backEdgeId = `${a.nodeId}-${id}`;
          // dont add edges with the same key
          edgeSet[edgeId] ||
            edgeSet[backEdgeId] ||
            edges.push({
              id: edgeId,
              source: id,
              target: a.nodeId,
              label,
            });
          edgeSet[id] = true;
          edgeSet[edgeId] = true;
          edgeSet[a.nodeId] = true;
        } else if (a._t instanceof TelegramActionMenu) {
          a.rows.forEach(r => r.buttons.forEach(b => addEdge(b.action, b.title.en || b.title.ru)));
        } else if (a instanceof TelegramActionIfElse) {
          addEdge(a.actionIf, 'if');
          addEdge(a.actionElse, 'else');
        }
      };
      if (recursive) {
        pageNode._m.filter(m => m instanceof TelegramAction).map(action => addEdge(action));
      }

      nodeSet[id] = true;
      return {
        id,
        data: { label: pageNode.name },
      };
    };
    let nodes = pageNodes.map(n => addNode(n));

    // layout nodes
    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: 'TB',
      ranker: layoutType,
      // ranker: 'tight-tree',
    });

    nodes = nodes.filter(n => edgeSet[n.id]);
    edges.forEach(e => {
      // add target node if not exists
      if (!nodeSet[e.target]) {
        const node = NamedNode.findOne(e.target);
        nodes.push(
          addNode(
            node || { _id: e.target, name: `404: ${e.target}` }, // with fallback
            false,
          ),
        );
      }

      g.setEdge(e.source, e.target, {});
    });

    nodes.forEach(n => g.setNode(n.id, { ...n.data, width: 150, height: 40 }));
    dagre.layout(g);
    nodes.forEach(n => {
      const { x, y } = g.node(n.id);
      n.position = { x, y };
    });
    // nodes.push({ id: Math.random().toFixed(8).slice(2), data: { label: '' }, position: { x: -100, y: -100 } });

    return {
      elements: [...nodes, ...edges],
    };
  }, [node, layoutType]);

  return (
    <ReactFlow
      key={layoutType}
      elements={elements}
      style={style}
      // isInteractive={false}
      onElementClick={({ id, source }) => {
        if (source) return;
        setSelected(selected => {
          const now = Date.now();
          // check doublrclick
          if (selected && selected.id === id && now - selected.time < 200) {
            setCurrent(id);
          }

          return { id, time: Date.now() };
        });
      }}
    >
      <MiniMap />
      <Controls />
      <div style={{ bottom: 10, left: 60, position: 'absolute', zIndex: 5 }}>
        <Radio.Group value={layoutType} onChange={setLayoutType}>
          {['network-simplex', 'tight-tree', 'longest-path'].map(v => (
            <Radio.Button key={v} size="small" value={v}>
              {v
                .split('-')
                .map(s => s[0])
                .join('')}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </ReactFlow>
  );
};

export default PageGraph;
