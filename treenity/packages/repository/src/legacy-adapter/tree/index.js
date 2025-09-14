const inherit = oldFormat => {
  console.log('Meta.inherit', oldFormat.name);
  return {
    inherit,
    extend: inherit,
  };
};

export const Meta = {
  inherit,
  create: inherit,
};

export const Class = Meta;
export const Enum = Meta;

export function addComponent(component, meta, context) {
  console.log('addComponent', context, component, meta);
}

export function getComponentInfo(type, context) {
  console.log('getComponentInfo', type, context);
}
