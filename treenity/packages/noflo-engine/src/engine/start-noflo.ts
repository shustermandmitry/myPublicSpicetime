import { Graph } from 'fbp-graph';
import { createNetwork } from 'noflo';
import { BaseNetwork } from 'noflo/lib/BaseNetwork';
import componentLoader from './component-context-loader';

interface InitialData {
  [node: string]: {
    [port: string]: any;
  };
}

function sendInitial(network: BaseNetwork, data: InitialData) {
  Object.keys(data).forEach(key => {
    Object.keys(data[key]).forEach(port => {
      network.addInitial(
        {
          from: { data: data[key][port] },
          to: {
            node: key,
            port,
          },
        },
        {},
      );
    });
  });

  return network.sendInitials();
}

export async function startNoFlo(graph: Graph, initialData?: InitialData) {
  const network = await createNetwork(graph, { componentLoader });
  // network.setFlowtrace(flowtrace);
  // await network.start();

  if (initialData) sendInitial(network, initialData);

  return network;
}
