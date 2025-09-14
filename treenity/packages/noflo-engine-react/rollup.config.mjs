import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['src/index.ts'];

export default [libraryConfig(inputs, 'browser', { only: true })];
