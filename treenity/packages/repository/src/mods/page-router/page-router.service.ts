import { awaitService, feathersContext, TreenityService } from '@treenity/feathers-service';
import { Application } from '../..';
import { TreeNode } from '@treenity/tree-api';
import { Entity } from '@treenity/entity';
import { PageRouterEntity } from '@/mods/page-router/page-router.entity';
import { Link } from '@treenity/core';
import { ResolveRequestPageRouterEntity } from '@/mods/page-router/resolve.request.page-router.entity';

class RouterServer extends TreenityService<PageRouterEntity> {
  private treeService!: TreenityService<Entity<TreeNode>>;
  customMethods: string[] = ['resolve'];

  async _setup(app: Application, path: string) {
    this.treeService = await awaitService<TreenityService<Entity<TreeNode>>>(app, 'sys/tree');
  }

  private normalizePath(url: string): string[] {
    return url.replace(/^\/+|\/+$/g, '').split('/');
  }

  private async checkPathInDatabase(path: string): Promise<string | null> {
    try {
      const node = await this.getNode(path);
      return new Link(node.url).pathname;
    } catch (error) {
      return null;
    }
  }

  private extractParamName(pattern: string): string | null {
    const match = pattern.match(/_([^_]+)_/);
    return match ? match[1] : null;
  }

  private isPattern(path: string): boolean {
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment.startsWith('_') && lastSegment.endsWith('_');
  }

  private async getNode(url: string): Promise<Entity<TreeNode>> {
    return await this.treeService.get(`pages/${url}`, { entity: true });
  }

  private async findPossiblePatterns(path: string): Promise<Array<{ id: string; path: string }>> {
    try {
      const node = await this.getNode(path);
      const children = await node.children();

      return children.data
        .map((p: any) => ({
          id: p.$id,
          path: p.$id.split('/').pop(),
        }))
        .filter(({ path }) => this.isPattern(path));
    } catch (error) {
      return [];
    }
  }

  async resolve({ url }: ResolveRequestPageRouterEntity): Promise<PageRouterEntity> {
    const segments = this.normalizePath(url);
    const urlParams: Record<string, string> = {};
    let currentPath = '';
    let resolvedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const nextPath = currentPath + (currentPath ? '/' : '') + segment;

      // Сначала проверяем точное совпадение
      const exactMatch = await this.checkPathInDatabase(nextPath);

      if (exactMatch) {
        currentPath = nextPath;
        resolvedPath = exactMatch;
        continue;
      }

      // Если точного совпадения нет, ищем паттерны
      const patterns = await this.findPossiblePatterns(currentPath);

      let matched = false;
      for (const { id, path } of patterns) {
        const paramName = this.extractParamName(path);
        if (!paramName) continue;

        urlParams[paramName] = segment;
        resolvedPath = id;
        currentPath = currentPath + (currentPath ? '/' : '') + path;
        matched = true;
        break;
      }

      if (!matched) {
        return { resolvedPath: url, params: urlParams, notFound: true };
      }
    }

    return { resolvedPath, params: urlParams, notFound: false };
  }
}

feathersContext.add('treenity.page-router.server', RouterServer);

export default RouterServer;
