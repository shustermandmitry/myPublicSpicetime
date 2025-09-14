import { stripSlashes } from '@treenity/js-shared/utils';

export interface ILink extends URL {
  context: string;
  contextAndHost: string;
  field: string;
  node: string;
  meta: string;
  metaPath: string;
  host: string;
  path: string;
}

const PROTO_REGEXP = /^([a-z-0-9\-_+]+):/;

type LinkOverrides = Partial<Pick<ILink, 'protocol' | 'meta' | 'field' | 'host'>>;

class Link extends URL implements ILink {
  // @ts-ignore - field will be set in constructor
  readonly path: string; // path without meta and field
  // @ts-ignore - field will be set in constructor
  readonly node: string; // node name or id
  // @ts-ignore - field will be set in constructor
  readonly meta: string; // meta name
  // @ts-ignore - field will be set in constructor
  readonly metaPath: string; // meta name
  // @ts-ignore - field will be set in constructor
  readonly field: string;

  constructor(source: string | Link | URL, override?: LinkOverrides) {
    if (source instanceof Link) {
      if (!override) {
        return source;
      }
      source = source.toString();
    } else if (source instanceof URL) {
      source = source.href;
    }

    const protocol = override?.protocol ?? 'tree:';

    if (!PROTO_REGEXP.test(source)) source = `${protocol}/` + stripSlashes(source);
    super(source);

    const [path, rest] = source.split('$');
    let [meta, field] = rest?.split(/[#^]/) ?? [];

    let pathname = this.pathname;
    if (pathname.endsWith('/')) this.pathname = pathname = pathname.slice(0, -1);

    this.path = pathname.split('$')[0];
    this.node = this.path.split('/').pop()!;

    if (override?.meta !== undefined) {
      meta = override.meta;
      this.pathname = this.path;
    }
    if (override?.field !== undefined) {
      this.hash = field = override.field;
    }
    if (override?.host !== undefined) {
      this.host = override.host;
    }
    if (override?.protocol !== undefined) {
      this.protocol = override.protocol;
    }

    this.meta = meta;
    this.metaPath = meta ? `${this.path}$${meta}` : this.path;
    this.field = field;

    Object.freeze(this);
  }

  get context(): string {
    return this.protocol.replace(':', '');
  }

  get contextAndHost(): string {
    return `${this.protocol}//${this.host}`;
  }

  parent(): Link {
    if (this.hash) {
      return new Link(this, { field: '' });
    }
    if (this.meta) {
      return new Link(this, { meta: '' });
    }

    return new Link(new URL('.', this));
  }
}

export default Link;
