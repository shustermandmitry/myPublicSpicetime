/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { TreeService } from '@/services/tree-fs-service';
import { stripSlashes } from '@feathersjs/commons';
import { Paginated } from '@feathersjs/feathers';
import { Link, NodeRaw, TypeContextInfo, types } from '@treenity/core';

import { TreeNodeType } from '@treenity/tree-api';
import path from 'path';
import { TrenityLayer } from './treenity-layer.entity';
import { TrenityType } from './treenity-type.entity';

const makeMakeNode =
  (basePath: string) =>
  (nodeUrl: string, metas: Record<string, any>): NodeRaw => {
    const url = basePath + nodeUrl;
    const name = path.basename(url);
    return {
      // @ts-ignore
      $id: url,
      $type: TreeNodeType.$type,
      $name: name,
      $perm: { '*': ['public'] },

      path: new Link(url).pathname,
      refs: [],
      url,
      metas,
    } satisfies NodeRaw;
  };

const makeNode = makeMakeNode('tree:/types/');

export class TypesTreeService implements TreeService {
  async get(path: string): Promise<NodeRaw> {
    path = stripSlashes(path);
    if (!path) {
      return makeNode(path, {
        type: new TrenityLayer({
          $id: path,
          name: path,
        }),
      });
    }

    const [layer, ...typeName] = path.split('/');

    if (typeName.length === 0) {
      return makeNode(layer, {
        type: new TrenityLayer({
          $id: layer,
          name: layer,
        }),
      });
    }

    const type: TypeContextInfo<any, any> = await (types as any)[layer].getInfo(typeName.join('.'));
    const url = `${layer}/${type.id}`;
    return makeNode(url, {
      type: new TrenityType({
        $id: url,
        name: type.id,
        component: type.component,
        options: type.options,
      }),
    });
  }

  async children(parent: string): Promise<Paginated<NodeRaw>> {
    parent = stripSlashes(parent);
    let nodes;
    if (!parent) {
      const layerToNode = (layerName: string) =>
        makeNode(layerName, {
          type: new TrenityLayer({
            $id: layerName,
            name: layerName,
          }),
        });

      nodes = Object.keys(types).map(layerToNode);
    } else {
      const [layer, ...type] = parent.split('/');
      if (type.length === 0) {
        nodes = (await (types as any)[layer].search('')).map((type: TypeContextInfo<any, any>) => {
          const url = `${layer}/${type.id}`;
          return makeNode(url, {
            type: new TrenityType({
              $id: url,
              name: type.id,
            }),
          });
        });
      }
    }
    if (nodes) {
      return {
        data: nodes,
        total: nodes.length,
        skip: 0,
        limit: 0,
      };
    }

    throw new Error('Method not implemented.');
  }
}
