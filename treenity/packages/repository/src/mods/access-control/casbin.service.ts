import {
  CasbinServiceMeta,
  casbinServiceSchema,
  RoleMeta,
  roleSchema,
} from '@/mods/access-control/casbin.meta';
import { FeathersService } from '@/utils/feathers-setup-service';
import { getMeta, getMetaByType } from '@/utils/get-meta';
import Link from '@/utils/link';
import { Forbidden } from '@feathersjs/errors';
import '@treenity/json-schema';
import { Application, Service } from '@feathersjs/feathers';
import { Node, NodeRaw, types } from '@treenity/core';
import type { ServiceConstructorParams, AuthParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { Enforcer, newEnforcer } from 'casbin';
import { unlink, writeFile } from 'node:fs/promises';

const modelFileName = 'casbin-model.conf';

export class Rules {
  private _allowed: string[] = [];
  private _denied: string[] = [];

  add(items: string | string[] | undefined) {
    if (!items) {
      return;
    }

    const rules = !Array.isArray(items) ? [items] : items;
    for (const rule of rules) {
      if (rule.charAt(0) === '-') {
        const _rule = rule.substring(1);
        if (this._denied.includes(_rule)) {
          continue;
        }
        this._denied.push(_rule);
        continue;
      }

      if (this._allowed.includes(rule)) {
        continue;
      }

      this._allowed.push(rule);
    }
  }

  get denied() {
    return this._denied;
  }

  get allowed() {
    return this._allowed.filter(role => !this._denied.includes(role));
  }
}

class CasbinService extends FeathersService<CasbinServiceMeta> {
  meta: CasbinServiceMeta;
  node: Node;
  enforcer: Enforcer | undefined;
  resolver: Service<NodeRaw> = null!;
  app!: Application;

  constructor({ meta, node }: ServiceConstructorParams<CasbinServiceMeta>) {
    super();
    this.meta = meta;
    this.node = node;
  }

  customMethods: string[] = ['check']

  async setup(app: Application<any, any>, path: string): Promise<void> {
    await super.setup(app, path);
    this.app = app;
    // Create config model file
    const model = Object.entries<string>(this.meta.model)
      .map(([key, value]) => `[${key}]\n${value}\n`)
      .join('\n');

    const data = new Uint8Array(Buffer.from(model));
    await writeFile(modelFileName, data);

    this.resolver = app.service('/sys/tree');

    // New enforcer with the specific treenity adapter to search permissions in the tree structure
    this.enforcer = await newEnforcer(modelFileName);

    await unlink(modelFileName);

    await this.loadRoles();
  }

  async addRole(node: NodeRaw) {
    const role = getMetaByType<RoleMeta>(node, 'db.access-control.role');
    if (role) {
      await this.enforcer!.addGroupingPolicy(role.name, role.inheritedFrom || '');
    }
  }

  async loadRoles() {
    let nodes = await this.resolver!.find!({ query: { path: this.path } });
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    for (let node of nodes) {
      await this.addRole(node);
    }
  }

  async grabRulesFromStructure(link: Link, method?: string): Promise<Rules> {
    const rules: Rules = new Rules();
    let nodes = await this.resolver!.find({ query: { searchUpward: true, path: link.path } });
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    const len = nodes.length;
    for (const node of nodes) {
      if (nodes[len - 1] === node) {
        const meta = getMeta(node, link);
        if (meta) {
          // @ts-ignore
          rules.add(meta.$perm?.[meta['defaultMeta']]);
        }
      }

      rules.add(node.$perm?.$);
    }

    if (method) {
      rules.add(nodes[len - 1].$perm?.[method]);
    }

    return rules;
  }

  async check(data: Record<string, any>, params: AuthParams) {
    const dontCheckPermission = this.app.get('dontCheckPermission');
    if (dontCheckPermission) {
      return;
    }

    const path = params.query?.path || data.query?.path || '';
    const method = params.query?.method || data.query?.method || '';

    let role = 'public';
    if (params.user?.role) {
      role = params.user?.role;
    }

    const link = new Link(path);
    try {
      const rules = await this.grabRulesFromStructure(link, method);

      const inheredDeniedRoles = await this.enforcer?.getImplicitUsersForRole(role);
      for (const deniedRule of rules.denied) {
        const isInhered = inheredDeniedRoles?.includes(deniedRule);

        if (isInhered) {
          console.log(`⚠️ Permission denied for role "${role}" in path: "${path}" #${method}`);
          throw new Forbidden('Permission denied');
        }
      }

      const inheredAllowedRoles = await this.enforcer?.getImplicitRolesForUser(role);
      for (const allowedRole of rules.allowed) {
        if (role === allowedRole) return true;

        const isInhered = inheredAllowedRoles?.includes(allowedRole);
        if (isInhered) {
          return true;
        }
      }
    } catch (e) {
      console.warn(e);
    }

    console.log(`⚠️ Permission denied for role ${role} in path: ${path} #${method}`);
    throw new Forbidden('Permission denied');
  }
}

types.schema.add('db.access-control.role', roleSchema, {});
types.schema.add('db.access-control.casbin', casbinServiceSchema, {});
feathersContext.add('sys.access-control.casbin', CasbinService);

export default CasbinService;
