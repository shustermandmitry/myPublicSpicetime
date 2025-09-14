export const logger = (moduleName: string) => {
  return (...log: any[]) => console.log(`[${moduleName}]:`, ...log);
};
