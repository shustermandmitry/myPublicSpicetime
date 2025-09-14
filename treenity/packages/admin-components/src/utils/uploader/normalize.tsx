export const defaultAllowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
export const defaultAllowedImageSize = (size?: number) => (size || 10) * 1024 * 1024; //10mb

export const normalizeSize = (size: number) => {
  const _size = size / 1024 / 1024;

  if (_size > 1) {
    return `${_size}Mb`;
  } else {
    return `${_size * 1000}Kb`;
  }
};

export const normalizeType = (types: string[]) => {
  const res = types.map((type, index) => {
    const separateType = type.split('/');
    const newType = separateType.at(-1);
    if (!newType) return;
    return newType.toUpperCase();
  });

  return String(res).replace(/,/g, '/');
};
