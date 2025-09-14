/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { registerComplexComponent } from '@/utils/register-complex-component';
import '@treenity/json-schema';
import { metaType, type MetaTypeImpl } from '@treenity/core';
import { JSONSchema7 } from '@treenity/json-schema';
import { addReactNoflo } from '@treenity/noflo-engine-react';
import { RENDER_CONTEXT } from '@treenity/ui-kit';
import ENTITY_TYPES from './entity-types';
import { withNode } from './shared/withNode';

const TYPES_TO_IGNORE = ['layout.webeditor', 'layout.flex'];

// registerComplexComponent('webeditor.test', {
//   $type: 'markup.container',
//   id: 'test',
//   children: [
//     {
//       $type: 'markup.container',
//       children: [
//         {
//           $type: 'basic.button',
//           id: 'test-btn',
//           label: 'kk',
//         },
//       ],
//     },
//     {
//       $type: 'markup.container',
//       styles: {
//         layout: {
//           display: 'block',
//         },
//       },
//       children: [
//         {
//           $type: 'basic.button',
//           styles: {
//             background: {
//               backgroundColor: '#ef4444',
//               backgroundSize: 'auto',
//               backgroundImage: undefined,
//             },
//           },
//           label: 'kk',
//         },
//         {
//           $type: 'basic.richEditor',
//           state: '<p>Hello World</p>',
//         },
//       ],
//     },
//   ],
// });

ENTITY_TYPES.forEach(component => {
  const options = 'ports' in component ? { ports: component.ports } : undefined;

  const entityType = metaType(component.EntityType);

  if (!component?.Render) {
    console.error(`Skipping component ${entityType.$type}, it has no Render function exported`);
    return;
  }

  // TODO: Will remove this later, currently we need to render layout in default context,
  //  until we implement the RenderContextProvider to the pages layouts.

  if (TYPES_TO_IGNORE.includes(entityType.$type)) {
    // @ts-ignore
    addReactNoflo(entityType.$type, component.Render, options);
    return;
  }

  addReactNoflo(
    entityType.inContext(RENDER_CONTEXT.RENDER),
    // @ts-ignore
    withNode(component.Render, {}, entityType.$type),
    // @ts-ignore
    options,
  );

  addReactNoflo(
    entityType.inContext(RENDER_CONTEXT.EDIT),
    // @ts-ignore
    withNode(component.Edit ?? component.Render, {}, entityType.$type),
    // @ts-ignore
    options,
  );
});

type EntityTypeWithLiteralType<T> = T & { EntityType: { readonly $type: string & {} } };

type Modules = {
  [K in keyof typeof ENTITY_TYPES]: EntityTypeWithLiteralType<(typeof ENTITY_TYPES)[K]>;
};

export type EntityTypes = Modules[number]['EntityType']['$type'];

export type Entities = {
  [K in EntityTypes]: Extract<Modules[number], { EntityType: { $type: K } }> & {
    schema: JSONSchema7;
  };
};

export const ENTITIES = ENTITY_TYPES.reduce((acc, module) => {
  const entityType = metaType(module.EntityType);
  acc[entityType.$type] = module as Entities[number];
  return acc;
}, {} as Entities);
export type IEntities = InstanceType<(typeof ENTITY_TYPES)[number]['Entity']>;

export type EntityTypeMap = {
  [K in keyof typeof ENTITIES]: InstanceType<(typeof ENTITIES)[K]['Entity']>;
};

export type InferEntityType<T extends IEntities> = T extends EntityTypeMap[keyof EntityTypeMap]
  ? T
  : never;

function isValidEntityType(type: string): type is keyof typeof ENTITIES {
  return type in ENTITIES;
}

export function getEntityType(type: string) {
  if (isValidEntityType(type)) {
    return ENTITIES[type].EntityType as MetaTypeImpl<IEntities>;
  }
  return undefined;
}

export const getEntityTypeById = (id: string): ReturnType<typeof getEntityType> => {
  const type = id.split('-')[0];
  return getEntityType(type);
};
