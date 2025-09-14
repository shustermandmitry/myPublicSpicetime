import { differenceBy } from '@s-libs/micro-dash';
import noflo from 'noflo';
import { main } from './nodejs/noflo-nodejs';
// import { typesList } from '../../tree';
// import createMetaComponent from './create-meta-component';
// import { NamedNode } from '../types/named-node/NamedNode.meta';
import TestComponent from './TestComponent';

const baseDir = `${process.env.PWD}/.run`;
const withProxy = object =>
  new Proxy(object, {
    get(target, prop, receiver) {
      const val = target[prop];
      if (typeof val === 'function') {
        return function (...args) {
          const toPrint = args.map(a => {
            if (a && a.componentName) return a.componentName;
            return a;
          });
          console.log('ComponentLoader: ', prop, toPrint);
          return val.apply(this, args);
        };
      }
      return val;
    },
  });

const observeNodes = (graph, cursor) => {
  const foundNodes = {};

  const ifNoflo = func => meta => {
    const type = meta.getType();
    if (type && type.definition.flo) func(meta, type);
  };

  const metasAdded = (node, metas) => {
    foundNodes[node._id] = { links: node.links() };
    const added = {};
    metas.forEach(
      ifNoflo((meta, type) => {
        graph.addNode(meta._id, `meta/${type.className}`, {
          meta: { id: meta._id },
        });

        added[meta._id] = true;
      }),
    );

    Object.values(foundNodes).forEach(n =>
      n.links.forEach(({ link, ...store }) => {
        if (!store.connected && added[link.metaID]) {
          graph.addEdge(link.metaID, link.field, store.metaID, store.field);
          store.connected = true;
        }
      }),
    );
  };
  const metasRemoved = (node, metas) =>
    metas.forEach(
      ifNoflo(meta => {
        const type = meta.getType();
        if (!type || !type.definition.flo) return;

        graph.removeNode(meta._id, () => {});
      }),
    );

  cursor.observe({
    added: node => metasAdded(node, node.meta()),

    changed: (node, old) => {
      const newMetas = differenceBy(node._m, old._m, m => m._id);
      const remMetas = differenceBy(old._m, node._m, m => m._id);
      metasAdded(node, newMetas);
      metasRemoved(node, remMetas);
    },

    removed: node => metasRemoved(node, node.meta()),
  });
};

const createNodeGraph = cursor => {
  const graph = new noflo.Graph('main');
  graph.baseDir = baseDir;
  graph.name = 'default/main';

  graph.on('addnode', (...args) => console.log(...args));
  graph.on('removenode', (...args) => console.log(...args));

  observeNodes(graph, cursor);

  graph.addNode('repeat', 'core/Repeat');
  graph.addInitial('{ "x": 42 }', 'repeat', 'in');
  graph.addNode('output', 'core/Output');

  return graph;
};

const registerComponents = loader => {
  // _.each(typesList(), (data, name) =>
  //   loader.registerComponent('meta', name, createMetaComponent(data.component)),
  // );
  loader.registerComponent('', 'test/TestComponent', TestComponent);
};

main({
  baseDir,
  // graph,
})
  .then(rt => {
    const loader = rt.component.loaders[baseDir];
    registerComponents(loader);

    const graph = createNodeGraph(NamedNode.getRoot().allChildrenDeepCursor());
    loader.registerGraph('default', 'main', graph);
    loader.registerGraph('test', 'test', graph);

    rt.component.loaders[baseDir] = withProxy(loader);
    rt.graph.registerGraph(graph.name, graph);

    rt.network._startNetwork(graph, graph.name, 'none', function (err) {
      if (err) console.error(err);
    });
  })
  .then(res => console.log('Runtime finished', res))
  .catch(err => console.error('NoFlo Runtime error', err));
