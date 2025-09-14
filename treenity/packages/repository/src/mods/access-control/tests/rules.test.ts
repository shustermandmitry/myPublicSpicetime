import { Rules } from '../casbin.service';

describe('Rules', () => {
  it('simple check', async () => {
    const rules = new Rules();

    rules.add('user');

    expect(rules.denied).toHaveLength(0);
    expect(rules.allowed).toHaveLength(1);

    expect(rules.allowed[0]).toEqual('user');
  });

  it('add array', async () => {
    const rules = new Rules();

    rules.add(['admin', 'user']);

    expect(rules.denied).toHaveLength(0);
    expect(rules.allowed).toHaveLength(2);

    expect(rules.allowed[0]).toEqual('admin');
    expect(rules.allowed[1]).toEqual('user');
  });

  it('add array2', async () => {
    const rules = new Rules();

    rules.add(['admin', 'user']);

    expect(rules.denied).toHaveLength(0);
    expect(rules.allowed).toHaveLength(2);

    expect(rules.allowed[0]).toEqual('admin');
    expect(rules.allowed[1]).toEqual('user');

    rules.add(['-public', '-user']);

    expect(rules.denied).toHaveLength(2);
    expect(rules.allowed).toHaveLength(1);

    expect(rules.denied[0]).toEqual('public');
    expect(rules.denied[1]).toEqual('user');
    expect(rules.allowed[0]).toEqual('admin');
  });

  it('the same value', async () => {
    const rules = new Rules();

    rules.add('user');
    rules.add('user');

    expect(rules.denied).toHaveLength(0);
    expect(rules.allowed).toHaveLength(1);

    expect(rules.allowed[0]).toEqual('user');
  });

  it('denied rule', async () => {
    const rules = new Rules();

    rules.add('user');
    rules.add('-user');

    expect(rules.denied).toHaveLength(1);
    expect(rules.allowed).toHaveLength(0);

    expect(rules.denied[0]).toEqual('user');
  });
});
