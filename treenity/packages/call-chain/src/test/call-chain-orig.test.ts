/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { chainCall } from '../call-chain';
import '../util-mixins';

interface IEventMeta {
  age: number;
  active: boolean;
  bot: {
    id: string;
    test(): Promise<string>;
    testObj(): Promise<{ x: string; a(): Promise<IEventMeta> }>;
    testSync(): number;
  };
  getEvent(type?: { active: boolean }): Promise<IEventMeta>;
}

const nodeData = {
  age: 10,
  active: true,
  bot: {
    id: 'bot-id',
    async test() {
      return 'bot test' /* + (type.active ? 'active' : 'inactive')*/;
    },
    async testObj() {
      return {
        x: 'hello world',
        a() {
          return nodeData.getEvent({ active: true });
        },
      };
    },
    testSync() {
      return 42;
    },
  },
  async getEvent(type?: { active: boolean }): Promise<IEventMeta> {
    return { ...nodeData, active: !!type?.active };
  },
};

// await (await (await nodeData.getEvent({ active: true })).getEvent({ active: true })).bot.test();

const nodeChain = chainCall(
  {
    path: '/sys/autorun',
    isLoaded: false,
    async load() {
      Object.assign(this, nodeData);
      return ((this as any).isLoaded = true);
    },
  } as unknown as IEventMeta,
  {
    fallback(_, params) {
      if (params.last.isLoaded) return undefined;
      params.last.isLoaded = true;
      return params.last.load?.()?.then(() => {
        params.idx--; // retry same field
        return params.last;
      });
    },
  },
);

describe('call-chain', () => {
  it('get deep obj', async function test() {
    const a = await nodeChain;

    const a1 = nodeChain.getEvent().bot.id;

    const strChain = chainCall('test');

    const objChain = chainCall({ x: 1, y: 2, o: { z: 3 } });

    const o = await objChain;
    const oa = await objChain.o;
    const ob = await objChain.x;

    const s2 = await strChain;
    const b = nodeChain.age;
    const e = await nodeChain.getEvent().bot.testSync();

    const eh = nodeChain.getEvent().bot.testSync();

    console.log(e);

    const event = await nodeChain.getEvent({ active: true });

    const bot = await nodeChain.getEvent({ active: false }).bot;
    const age = await nodeChain.getEvent({ active: true }).age;
    const obj = await nodeChain.getEvent({ active: true }).bot.testObj();
    const obj2 = await nodeChain.getEvent({ active: false }).getEvent({ active: true }).bot.test();

    const y = await nodeChain.getEvent({ active: true }).bot.test();

    // const botProm = nodeChain.getEvent({ active: false }).bot;

    expect(await bot.test()).toBe('bot test');
    expect(y).toBe('bot test');
    expect(obj2).toBe('bot test');
    expect(obj.x).toBe('hello world');
    expect(age).toBe(10);
  });

  it('iobj', async () => {
    interface IObj {
      obj: number;
    }

    const numPromise: Promise<number> & Number = null!;
    const num = await numPromise;

    const objPromise: Promise<IObj> & IObj = null!;
    const obj = await objPromise;
  });

  it('caching of sequental calls', async () => {
    class Test {
      calls: number = 0;
      async wait<T>(ms: number, result: T): Promise<T> {
        this.calls++;
        return new Promise(res => setTimeout(() => res(result), ms));
      }
    }

    const test = new Test();
    const chain = chainCall(test);
    const res1 = await chain.wait(100, 1);
    const res2 = chain.wait(100, 1);
    chain.wait(100, 1).$reset();
    const res3 = chain.wait(100, 1);

    expect(await Promise.all([res1, res2, res3])).toEqual([1, 1, 1]);
    expect(test.calls).toBe(2);
  });
});
