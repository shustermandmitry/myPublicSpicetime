const uixExports = await uix.require('uix:test/uix-export');

console.log('uixExports', uixExports);

const { helloWorld } = uixExports;

helloWorld();

uix.add(() => {
  return <div>{helloWorld()}</div>;
});
