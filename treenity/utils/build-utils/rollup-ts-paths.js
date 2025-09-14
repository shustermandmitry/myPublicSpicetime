import { replaceTscAliasPaths } from 'tsc-alias';

/**
 * Rollup plugin to fix paths like '@/somefile' to '../../somefile' in .d.ts (TypeScript declaration files)
 */
export default function tsFixPaths() {
  return {
    name: 'rollup-ts-paths',
    writeBundle(options) {
      return replaceTscAliasPaths({
        outDir: options.dir,
        fileExtensions: { inputGlob: '{d.ts,ts}' },
      });
    },
  };
}
