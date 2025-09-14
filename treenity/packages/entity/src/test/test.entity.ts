import { metaType } from '@treenity/core';
import { entity, method, write, writeMethod } from '../decorators';

export const TestEntityType = metaType<TestEntityClient>('test-entity');
// don't remove, for tests
export const TestTypeServer = TestEntityType.inContext('server');
// don't remove, for tests
export const TestTypeServer2 = TestEntityType.server;



@entity(TestEntityType)
export class TestEntityClient {
  a: number = 0;
  b: string = 'def';
  c!: Date;
  d?: boolean;

  _unwatched?: string;

  @write
  writeMe(change: Partial<TestEntityClient>) {
    Object.assign(this, change);
  }

  @method
  async callMe(param: string): Promise<string> {
    return (this.b = 'callMe_' + param);
  }

  @writeMethod
  async callWriteMe(param: string): Promise<void> {
    this.b = param;
  }
}

