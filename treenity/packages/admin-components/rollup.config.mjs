import { libraryConfig } from '@treenity/build-utils/library-config.js';
import copy from 'rollup-plugin-copy';

const inputs = [
  'src/index.ts',
  'src/components.ts',
  'src/widgets.ts',
  'src/utils.ts',
  'src/hooks.ts',
  'src/theme.ts',
  'src/elements.ts',
];

export default [
  libraryConfig(inputs, 'browser', {
    check: false,
    only: true,
    external: ['react', 'react-dom', '@emotion/react', '@emotion/styled, antd, @remix-run/react'],
    plugins: [
      copy({
        targets: [{ src: 'components/icon/icon-component/iconmoon/fonts', dest: 'dist' }],
      }),
    ],
  }),
];
