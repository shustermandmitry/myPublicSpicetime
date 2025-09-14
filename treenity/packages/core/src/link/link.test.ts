import assert from 'assert';
import Link from './link';

const link = new Link('tree://some-service/test1/test2/test3$meta-service#method');

describe('tree-url', () => {
  test('parse url', () => {
    // write tests for link class
    assert.strictEqual(link.protocol, 'tree:');
    assert.strictEqual(link.context, 'tree');
    assert.strictEqual(link.contextAndHost, 'tree://some-service');
    assert.strictEqual(link.host, 'some-service');
    assert.strictEqual(link.meta, 'meta-service');
    assert.strictEqual(link.field, 'method');
    assert.strictEqual(link.node, 'test3');
    assert.strictEqual(link.path, '/test1/test2/test3');
  });

  test('parse parent url', () => {
    const fieldLink = new Link(link);
    expect(fieldLink.toString()).toEqual(
      'tree://some-service/test1/test2/test3$meta-service#method',
    );

    const metaLink = fieldLink.parent();
    expect(metaLink.toString()).toEqual('tree://some-service/test1/test2/test3$meta-service');
    expect(fieldLink.toString()).toEqual(
      'tree://some-service/test1/test2/test3$meta-service#method',
    );

    const nodeLink = metaLink.parent();
    assert.strictEqual(nodeLink.toString(), 'tree://some-service/test1/test2/test3');

    const pNodeLink = nodeLink.parent();
    assert.strictEqual(pNodeLink.toString(), 'tree://some-service/test1/test2');

    const ppNodeLink = pNodeLink.parent();
    assert.strictEqual(ppNodeLink.toString(), 'tree://some-service/test1');

    const pppNodeLink = ppNodeLink.parent();
    assert.strictEqual(pppNodeLink.toString(), 'tree://some-service');

    const ppppNodeLink = pppNodeLink.parent();
    assert.strictEqual(ppppNodeLink.toString(), 'tree://some-service');
  });

  test('override url params', () => {
    const overrideLink = new Link(link, {
      meta: 'new-meta',
      field: 'new-field',
    });

    expect(overrideLink.meta).toEqual('new-meta');
    expect(overrideLink.field).toEqual('new-field');
  });

  test('override url params with empty meta', () => {
    const overrideLink = new Link(link, {
      meta: '',
      field: 'new-field',
    });

    expect(overrideLink.meta).toEqual('');
    expect(overrideLink.field).toEqual('new-field');
  });

  test('override url params with empty field', () => {
    const overrideLink = new Link(link, {
      meta: 'new-meta',
      field: '',
    });

    expect(overrideLink.meta).toEqual('new-meta');
    expect(overrideLink.field).toEqual('');
  });

  test('override url params with empty meta and field', () => {
    const overrideLink = new Link(link, {
      meta: '',
      field: '',
    });

    expect(overrideLink.meta).toEqual('');
    expect(overrideLink.field).toEqual('');
  });

  test('override url host', () => {
    const overrideLink = new Link(link, { host: 'new-host', field: '' });

    expect(overrideLink.host).toEqual('new-host');
    expect(overrideLink.toString()).toEqual('tree://new-host/test1/test2/test3$meta-service');
  });

  test('override url protocol', () => {
    const overrideLink = new Link(link, { host: 'new-host', protocol: 'new:', field: '' });

    expect(overrideLink.protocol).toEqual('new:');
    expect(overrideLink.toString()).toEqual('new://new-host/test1/test2/test3$meta-service');
  });

  test('no protocol url', () => {
    const overrideLink = new Link('some/short/node-path/node-name');

    expect(overrideLink.protocol).toEqual('tree:');
    expect(overrideLink.toString()).toEqual('tree:/some/short/node-path/node-name');
    expect(overrideLink.path).toEqual('/some/short/node-path/node-name');
    expect(overrideLink.node).toEqual('node-name');
    expect(overrideLink.meta).toEqual(undefined);
  });

  test('no host link', () => {
    const linkWithoutHost = new Link('tree:/some-service/test1/test2/test3$meta-service#method');

    expect(linkWithoutHost.protocol).toEqual('tree:');
    expect(linkWithoutHost.host).toEqual('');
    expect(linkWithoutHost.toString()).toEqual(
      'tree:/some-service/test1/test2/test3$meta-service#method',
    );
    expect(linkWithoutHost.path).toEqual('/some-service/test1/test2/test3');
    expect(linkWithoutHost.node).toEqual('test3');
    expect(linkWithoutHost.meta).toEqual('meta-service');
  });
});
