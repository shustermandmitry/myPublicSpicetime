import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CatTypesDictOfTypes',
      fileName: (format) => `cat.types.dict_of_types.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        '@spicetime/base.types',
        '@local/core_error'
      ],
      output: {
        globals: {
          '@spicetime/base.types': 'BaseTypes',
          '@local/core_error': 'CoreError'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    target: 'es2020'
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@spicetime/base.types': resolve(__dirname, '../base.types/src'),
      '@local/core_error': resolve(__dirname, '../../../error')
    }
  },

  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/index.ts'
      ]
    },
    // No setup files needed
  }
});
