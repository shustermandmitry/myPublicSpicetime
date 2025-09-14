import replace from 'vite-plugin-filter-replace';

export const replaceNoflo = replace([
  {
    filter: 'noflo/lib/loader/register.js',
    replace(source, path) {
      return 'export default {}';
    },
  },
]);
