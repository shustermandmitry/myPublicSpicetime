import { camelToUnderscore } from '@treenity/js-shared/utils';
import { GraphJson, GraphJsonEdge } from 'fbp-graph/lib/Types';
import { Edge, NodeEngineStore } from './node-engine-store';

export function findLayer(layers: any, layerName: string) {
  const links = layers.find((i: { type: string }) => i.type === layerName);
  if (!links) throw new Error(`layer ${layerName} not found`);
  return links;
}

const parsePortName = (port: string) => camelToUnderscore(port);

export function mapStoreToGraphJson(
  edges: NodeEngineStore['edges'],
  components: NodeEngineStore['components'],
): GraphJson {
  const connections: GraphJsonEdge[] = edges
    .map((edge: Edge) => ({
      src: {
        process: edge.source,
        port: parsePortName(edge.sourceHandle!),
      },
      tgt: {
        process: edge.target,
        port: parsePortName(edge.targetHandle!),
      },
    }))
    .filter(Boolean) as GraphJsonEdge[];

  const processes: GraphJson['processes'] = {};
  Object.values(components).forEach(node => {
    processes[node.$id] = {
      metadata: { setPorts: node.setPorts },
      component: (node as any).$type,
    };
  });
  return {
    connections,
    processes,
  };
}

const addNode = (name: string, data: any) => ({
  id: name,
  name: name,
  type: 'node_factory',
  model: {
    id: name,
    type: data.component,
    title: name,
    url: 'mock-url',
    data: {},
  },
  x: data.metadata.x,
  y: data.metadata.y,
});

const addLink = (
  id: string,
  source: string,
  sourcePort: string,
  target: string,
  targetPort: string,
) => {
  return {
    id,
    locked: true,
    type: 'link_factory',
    source,
    sourcePort: sourcePort + '/out',
    target,
    targetPort: targetPort + '/in',
    labels: [],
    width: 3,
    color: '#27AE60',
    curvyness: 50,
    selectedColor: 'rgb(0,192,255)',
  };
};

export function mapGraphJsonToScheme({ connections, processes }: GraphJson) {
  const nodes = Object.entries(processes!).reduce(
    (obj, [id, value]) => {
      obj[id] = addNode(id, value);
      return obj;
    },
    {} as Record<string, any>,
  );

  const links = Object.entries(connections!).reduce(
    (obj, [id, { tgt, src }]) => {
      obj[id] = addLink(id, src!.process, src!.port, tgt.process, tgt.port);
      return obj;
    },
    {} as Record<string, any>,
  );

  const graph = {
    id: 'graph',
    offsetX: 0,
    offsetY: 0,
    zoom: 100,
    gridSize: 16,
    layers: [
      {
        type: 'diagram-nodes',
        id: 'diagram-nodes',
        transformed: true,
        models: nodes,
      },
      {
        type: 'diagram-links',
        id: 'diagram-links',
        isSvg: true,
        transformed: true,
        extras: {},
        models: links,
      },
    ],
  };

  return graph;
}
