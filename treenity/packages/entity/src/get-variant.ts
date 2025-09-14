// TODO:
// import { Entity, EntityImpl } from './entity';

// type VariantOrder<K> = K[] | ((currentVariant: K) => K[]);

// export function getEntityVariant<T, K extends string[]>(
//   entity: EntityImpl<T, K>,
//   variant: K[number],
//   order?: VariantOrder<K[number]>,
// ) {
//   if (!order) {
//     return entity.getOverrides(variant);
//   }

//   const mergeOrder = typeof order === 'function' ? order(variant) : order;

//   return mergeOrder.reduce(
//     (result, variantKey) => ({
//       ...result,
//       ...entity['$overrides']?.[variantKey],
//     }),
//     {} as Partial<T>,
//   );
// }

// // Example usage:
// class Test extends EntityImpl<{ a: string }, ['sm', 'md', 'lg']> {
//   name!: string;
// }

// const entity = new Test();

// getEntityVariant(entity, 'md');

// getEntityVariant(entity, 'md', ['sm', 'md']);

// getEntityVariant(entity, 'md', current => {
//   const breakpoints = ['sm', 'md', 'lg'] as const;
//   const currentIndex = breakpoints.indexOf(current);
//   return breakpoints.slice(0, currentIndex + 1);
// });
