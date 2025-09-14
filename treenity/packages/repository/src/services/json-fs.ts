import {
  AdapterBase,
  AdapterParams,
  AdapterQuery,
  AdapterServiceOptions,
  PaginationOptions,
  select,
  sorter,
} from '@feathersjs/adapter-commons';
import { _ } from '@feathersjs/commons';
import { NotFound } from '@feathersjs/errors';
import { Id, Paginated } from '@feathersjs/feathers';
import { Link } from '@treenity/core';
import type { CliParams } from '@treenity/feathers-service';
import { Mutex } from 'async-mutex';
import { applyPatch, Operation } from 'fast-json-patch';
import fs from 'node:fs/promises';
import path from 'path';
import sift from 'sift';

type JSONValue = JSONObject | JSONValue[] | string | number | boolean | null;
type JSONObject = { [key: string]: JSONValue };

const DEFAULT_DEPTH = 1;

const getDirectories = async (
  baseDir: string,
  currentDir: string,
  depth: number = DEFAULT_DEPTH,
) => {
  const dirs = (await fs.readdir(path.join(baseDir, currentDir), { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const childrenPath = dirs.map(dir => path.join(currentDir, dir));

  if (depth > 1) {
    for (const child of childrenPath) {
      const paths = await getDirectories(baseDir, child, depth - 1);
      childrenPath.push(...paths);
    }
  }

  return childrenPath;
};

const _select = (data: any, params: any, ...args: string[]) => {
  const base = select(params, ...args);

  return base(JSON.parse(JSON.stringify(data)));
};

export interface JsonFsServiceOptions<T = any> extends AdapterServiceOptions {
  rootPath: string;
  startId?: number;
  matcher?: (query: any) => any;
  sorter?: (sort: any) => any;
}

interface ServiceParams
  extends AdapterParams<AdapterQuery, Partial<JsonFsServiceOptions>>,
    CliParams {
  path: string;
  searchUpward?: boolean;
  depth?: number;
}

function makeEmptyNode($path: string) {
  return {
    $id: $path,
    $name: path.basename($path),
    $type: 'tree-node',
    $refs: [],
    $perm: { '*': 'public' },
    metas: {},
  };
}

export class JsonFsService<T> extends AdapterBase<
  T,
  T,
  Partial<T>,
  AdapterParams,
  JsonFsServiceOptions<T>
> {
  async setup(app: any, path: string) {
    if (!(await fs.stat(this.options.rootPath))?.isDirectory()) {
      throw new Error(`rootPath is not a directory: ` + this.options.rootPath);
    }
  }

  async _get(filePath: Id, params?: Partial<ServiceParams>): Promise<T> {
    const $path = this.makePath(filePath);
    return this.getMutex($path).runExclusive(() => this._getNoLock(filePath, params));
  }

  async _getNoLock(filePath: Id, params?: Partial<ServiceParams>): Promise<T> {
    const $path = this.makePath(filePath);

    try {
      const json = await fs
        .readFile($path)
        .then(f => JSON.parse(f.toString()))
        .catch(async e => {
          if (
            e.message.startsWith('ENOENT') &&
            (await fs.stat(path.dirname($path)))?.isDirectory()
          ) {
            return makeEmptyNode($path);
          }
          throw e;
        });

      (json as any).path = filePath;
      return json;
    } catch (err: any) {
      throw new NotFound('node not found: ' + filePath, { path: filePath, cause: err });
    }
  }

  async get(filePath: Id, params?: ServiceParams): Promise<T> {
    return this._get(filePath, params);
  }

  _create(data: T, params?: ServiceParams, ctx?: any): Promise<T>;
  _create(data: T[], params?: ServiceParams, ctx?: any): Promise<T[]>;
  async _create(data: T | T[], params: ServiceParams): Promise<T | T[]> {
    if (Array.isArray(data)) throw new Error('Array not supported in create');

    const $path = this.makePath(params.path);
    const mutex = this.getMutex($path);

    return mutex.runExclusive(async () => {
      await fs.mkdir(path.dirname($path), { recursive: true });
      await this._updateNoLock(params.path, data, params);
      return this._getNoLock(params.path);
    });
  }

  create(data: T, params: ServiceParams): Promise<T> {
    return this._create(data, { ...params, query: this.sanitizeQuery(params) });
  }

  async _update(id: Id, data: T, params?: ServiceParams, ctx?: any): Promise<T> {
    const $path = this.makePath(id);
    const mutex = this.getMutex($path);

    return mutex.runExclusive(async () => {
      await fs.writeFile($path, JSON.stringify(data, null, 2));
      return data;
    });
  }

  async _updateNoLock(id: Id, data: T, params?: ServiceParams, ctx?: any): Promise<T> {
    const $path = this.makePath(id);

    await fs.writeFile($path, JSON.stringify(data, null, 2));
    return data;
  }

  // @ts-ignore
  async _patch(id: Id | null, data: Partial<T> | Operation[], params?: ServiceParams): Promise<T> {
    if (!id) throw new Error('Id must be set');

    const $path = this.makePath(id);
    const mutex = this.getMutex($path);

    return mutex.runExclusive(async () => {
      const nodeRaw = await this._getNoLock(id);
      if (Array.isArray(data)) {
        const patchedRaw = applyPatch(nodeRaw, data).newDocument;
        await this._updateNoLock(id, patchedRaw);
        return { id, patches: data } as T;
      }
      throw new Error('Only patches supported in patch, use update for updating');
    });
  }

  patch(id: string, data: Operation[], params: ServiceParams) {
    return this._patch(id, data, { ...params, query: this.sanitizeQuery(params) });
  }

  _remove(id: null, params?: ServiceParams): Promise<T[]>;
  _remove(id: Id, params?: ServiceParams): Promise<T>;
  _remove(id: Id | null, params?: ServiceParams): Promise<T | T[]>;
  async _remove(id: Id | null, params?: ServiceParams): Promise<T | T[]> {
    if (!id) throw new Error('Id must be set');

    const $path = this.makePath(id);
    const mutex = this.getMutex($path);

    return mutex.runExclusive(async () => {
      const pathname = new Link(id as string).pathname;

      const nodeDirs = await getDirectories(this.options.rootPath, pathname);
      if (nodeDirs.some(dir => !dir.startsWith('$'))) {
        throw new Error('Cannot remove non-empty directory');
      }

      const res = await this._getNoLock(id as string, params);

      await fs.rm(path.dirname($path), { recursive: true, force: true });

      return res;
    });
  }

  remove(id: string, params: ServiceParams): Promise<T> {
    return this._remove(id, { ...params, query: this.sanitizeQuery(params) });
  }

  private makePath(id: unknown): string {
    if (typeof id !== 'string') throw new Error('id must be string');

    const pathname = new Link(id).pathname;

    return path.join(this.options.rootPath, pathname, '$.json');
  }

  private mutexes: Map<string, Mutex>;

  constructor(options: JsonFsServiceOptions<T>) {
    super({
      id: 'id',
      matcher: sift,
      sorter,
      startId: 0,
      ...options,
    });
    this.mutexes = new Map();
  }

  private getMutex(filePath: string): Mutex {
    if (!this.mutexes.has(filePath)) {
      this.mutexes.set(filePath, new Mutex());
    }
    return this.mutexes.get(filePath)!;
  }

  async getEntries(params: ServiceParams): Promise<T[]> {
    const { path: dirPath, searchUpward, depth, query } = params.query || {};
    if (typeof dirPath !== 'string' || !dirPath || dirPath.includes('..')) {
      throw new Error(`path is required or invalid: ` + dirPath);
    }

    let nodes;
    if (searchUpward) {
      let nodeDirs = dirPath
        .split('/')
        .filter(Boolean)
        .reduce<string[]>((res, dir) => {
          res.push(res.length ? res[res.length - 1] + '/' + dir : dir);
          return res;
        }, []);

      nodeDirs.unshift('/');

      nodes = await Promise.all(nodeDirs.map(nodeDir => this._get(nodeDir)));
    } else {
      nodes = await this.readDirectories(dirPath, depth);
    }

    return nodes;
  }

  getQuery(params: ServiceParams) {
    const { $skip, $sort, $limit, $select, path, searchUpward, depth, raw, ...query } =
      params.query || {};

    return {
      query,
      filters: { $skip, $sort, $limit, $select },
    };
  }

  private async readDirectories(dirPath: string, depth: number = DEFAULT_DEPTH): Promise<T[]> {
    const nodeDirs = await getDirectories(this.options.rootPath, dirPath, depth);

    const result = await Promise.all(nodeDirs.map(nodeDir => this._get(nodeDir)));

    return result;
  }

  async find(params: ServiceParams): Promise<Paginated<T> | T[]> {
    return this._find({
      ...params,
      query: await this.sanitizeQuery(params),
    });
  }

  _find(
    _params: ServiceParams & {
      paginate?: PaginationOptions | undefined;
    },
  ): Promise<Paginated<T>>;
  _find(_params: ServiceParams & { paginate: false }): Promise<T[]>;
  _find(params: ServiceParams): Promise<T[] | Paginated<T>>;

  async _find(params: ServiceParams): Promise<any> {
    const { paginate } = this.getOptions(params);
    const { query, filters } = this.getQuery(params);

    let values = await this.getEntries(params);
    const hasSkip = filters.$skip !== undefined;
    const hasSort = filters.$sort !== undefined;
    const hasLimit = filters.$limit !== undefined;
    const hasQuery = _.keys(query).length > 0;

    if (hasSort) {
      values.sort(this.options.sorter!(filters.$sort));
    }

    if (paginate) {
      if (hasQuery) {
        values = values.filter(this.options.matcher!(query));
      }

      const total = values.length;

      if (hasSkip) {
        values = values.slice(filters.$skip);
      }

      if (hasLimit) {
        values = values.slice(0, filters.$limit);
      }

      const result: Paginated<T> = {
        total,
        limit: filters.$limit || Number.MAX_SAFE_INTEGER,
        skip: filters.$skip || 0,
        data: values.map(value => _select(value, params, this.id)),
      };

      return result;
    }

    /*  Without pagination, we don't have to match every result and gain considerable performance improvements with a breaking for loop. */
    if (hasQuery || hasLimit || hasSkip) {
      let skipped = 0;
      const matcher = this.options.matcher!(query);
      const matched = [];

      if (hasLimit && filters.$limit === 0) {
        return [];
      }

      for (let index = 0, length = values.length; index < length; index++) {
        const valueArr = values[index];
        // @ts-ignored
        const value = { ...valueArr, metas: Object.values(valueArr.metas || {}) };

        if (hasQuery && !matcher(value, index, values)) {
          continue;
        }

        if (hasSkip && filters.$skip! > skipped) {
          skipped++;
          continue;
        }

        matched.push(_select(valueArr, params, this.id));

        if (hasLimit && filters.$limit === matched.length) {
          break;
        }
      }

      return matched;
    }

    return values.map(value => _select(value, params, this.id));
  }
}
