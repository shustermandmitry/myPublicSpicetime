// const opn = require('opn');
const settings = require('./settings');
const server = require('./server');
const runtime = require('./runtime');
// const debug = require('./debug');

exports.main = async opts => {
  const options = await settings.load();
  Object.assign(options, opts);
  const graph = await runtime.loadGraph(options);
  const rt = await server.create(graph, options);
  await runtime.subscribe(rt, options);
  await server.start(rt, options);
  await runtime.ping(rt, options);

  if (options.batch) {
    return;
  }

  console.log(`NoFlo runtime is now listening at ${server.getUrl(options)}, id: ${options.id}`);
  if (options.secret) {
    console.log(`Live IDE URL: ${server.liveUrl(options)}`);
  }

  return rt;
  // debug.showError(err);
};

if (!module.parent) {
  exports.main();
}
