import jestConf from '@treenity/build-utils/jest-node.config.mjs';

export default Object.assign(jestConf(), {
  testEnvironment: 'jsdom',
});
