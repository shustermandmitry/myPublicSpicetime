import { types } from '@treenity/core';
import { GraphJson } from 'fbp-graph/lib/Types';
import type { ComponentLoader } from 'noflo';
import * as noflo from 'noflo';
import { Network } from 'noflo/lib/Network';
import { useLayoutEffect, useRef } from 'react';
import { Edge } from 'reactflow';
import { mapStoreToGraphJson } from './map-editor-scheme-to-graph-json';
import { NodeEngineStore, RuntimeComponent } from './node-engine-store';
import { useEngineStore } from './NodeEngineContext';

class ContextTypeComponentLoader {
  async listComponents() {
    // console.log('ListComponents');
  }

  async load(type: any, metadata: any) {
    // console.log('Load', type, metadata);
    const [createComponent] = await types.noflo.get(type);
    return createComponent(metadata);
  }
}

/**
 * create noflo network, not yet started (delayed execution)
 * you have to call network.connect(), then network.start() to start it
 * @param json
 */
async function createNoFlo(json: GraphJson) {
  const graph = await noflo.graph.loadJSON(json);
  // console.log(graph.toJSON());
  // const componentLoader = new VirtualLoader('');
  const componentLoader = new ContextTypeComponentLoader() as unknown as ComponentLoader;
  const network = await noflo.createNetwork(graph, { componentLoader, delay: true });

  return network;
}

const selector = (state: NodeEngineStore): [Edge[], RuntimeComponent[]] => [
  state.edges,
  state.components,
];

export function NofloEngineRunner() {
  const [edges, components] = useEngineStore(selector);

  // const [nofloGraph, setNodeGraph] = useState<SerializedModel>(() => value.graph);

  const networkRef = useRef<Network | undefined>();

  useLayoutEffect(() => {
    const nofloGraph = mapStoreToGraphJson(edges, components);

    const networkProm = createNoFlo(nofloGraph);
    networkProm.then(async network => {
      await network.connect();
      await network.start();

      networkRef.current = network;
    });

    return () => {
      networkProm.then(network => network.stop());
    };
  }, [edges, components]);

  return null;
}
