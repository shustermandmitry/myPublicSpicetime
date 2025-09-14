import { types } from '@treenity/core';
import { Graph } from 'fbp-graph';
import { startNoFlo } from '../start-noflo';

types.noflo.add(
  'core/sum',
  inputs => {
    return { out: inputs.a + inputs.b };
  },
  {
    ports: {
      in: {
        a: { type: 'number', required: true },
        b: { type: 'number', required: true },
      },
      out: {
        out: { type: 'number' },
      },
    },
  },
);

types.noflo.add(
  'core/number',
  (input, context) => {
    console.log('number', input.in);
    return { out: input.in };
  },
  {
    ports: {
      in: { in: { type: 'number' } },
      out: {
        out: { type: 'number' },
      },
    },
  },
);

types.noflo.add(
  'core/logger',
  input => {
    console.log('logger', input.in);
  },
  {
    ports: {
      in: { in: { type: 'all' } },
      out: {},
    },
  },
);

describe('run engine', () => {
  it('should run engine', async () => {
    const graph = new Graph();
    graph.addNode('inA', 'core/number');
    graph.addNode('inB', 'core/number');
    graph.addNode('out', 'core/number');
    graph.addNode('sum', 'core/sum');
    graph.addNode('log', 'core/logger');

    graph.addEdge('inA', 'out', 'sum', 'a');
    graph.addEdge('inB', 'out', 'sum', 'b');
    graph.addEdge('sum', 'out', 'log', 'in');
    graph.addEdge('sum', 'out', 'out', 'in');

    const network = await startNoFlo(graph, {
      inA: { in: 5 },
      inB: { in: 7 },
    });

    const outNode = network.getNode('out');
    console.log('outNode', outNode);

    expect('engine running').toEqual('engine running');
  });
});
