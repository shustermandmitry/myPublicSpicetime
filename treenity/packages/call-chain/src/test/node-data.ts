/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { chainCall } from '../call-chain';

export interface IEventMeta {
  age: number;
  bot: {
    test(): Promise<string>;
    testObj(): Promise<{ x: string; a(): Promise<IEventMeta> }>;
  };
  getEvent(type: { active: boolean }): Promise<IEventMeta>;
}

export const nodeData = {
  getEvent: async (type: { active: boolean }): Promise<IEventMeta> => {
    return {
      age: 10,
      bot: {
        async test() {
          return 'bot ' + (type.active ? 'active' : 'inactive');
        },
        async testObj() {
          return {
            x: 'hello world',
            a() {
              return nodeData.getEvent({ active: true });
            },
          };
        },
      },
      async getEvent(type: { active: boolean }): Promise<IEventMeta> {
        return nodeData.getEvent(type);
      },
    };
  },
};

export const nodeEntity = chainCall({
  path: '/sys/autorun',
  isLoaded: false,
  async load() {
    Object.assign(this, nodeData);
    return ((this as any).isLoaded = true);
  },
} as unknown as IEventMeta);
