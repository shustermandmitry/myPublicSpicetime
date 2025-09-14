import { entity, method, writeMethod } from '../decorators';
import { TestEntityClient, TestEntityType } from './test.entity';

@entity(TestEntityType, 'server')
export class TestEntityServer extends TestEntityClient {
  serverOnlyProperty!: string;

  @method
  async callMe(param: string): Promise<string> {
    return (this.b = 'callMeServer_' + param);
  }

  @writeMethod
  async callWriteMe(param: string): Promise<void> {
    this.b = 'callWriteMe_' + param;
  }
}