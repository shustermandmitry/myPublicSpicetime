/**
 * Try hard to extract best names for chunks
 */
export function entryFileNames(info) {
  const name = info.facadeModuleId.split('/').findLast((i) => !i.startsWith('index')).split('.')[0];
  return `${name}-[hash].mjs`;
}

export function chunkFileNames(info) {
  let moduleName;
  if (info.moduleIds.length === 1) {
    moduleName = info.moduleIds[0];
  } else if (info.facadeModuleId) {
    moduleName = info.facadeModuleId;
  } else {
    moduleName = info.moduleIds.filter(m => m[0] !== '/' && m[1] !== '/')[0] || info.name;
  }
  if (moduleName === 'index') {
    moduleName = info.moduleIds[info.moduleIds.length - 1];
  }

  const parts = moduleName.split('/');
  if (parts.length > 1) {
    moduleName = parts.map(p => p.split('.')[0]).filter((p) => p !== 'index').slice(-3).join('_');
  }

  const name = moduleName.replace(/\W/g, '').replace(/[A-Z]/g, (m, i) => `${i ? '_' : ''}${m.toLowerCase()}`);
  return `assets/${name}-[hash].mjs`;
}
