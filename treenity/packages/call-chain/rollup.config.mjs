import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['src/index.ts', 'src/react-mixins.ts'];

export default [libraryConfig(inputs, 'browser', { only: true })];
