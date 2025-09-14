import { entity, method, write, writeMethod } from '../decorators';
import { TestEntityClient } from './test-no-type.entity';

/**
 * Test server entity extended from the test client entity
 */
@entity(TestEntityClient, 'server')
export class TestEntityServer extends TestEntityClient {
  /**
   * This is a server only property
   */
  serverOnlyProperty!: string;

  /**
   * This should be called, if you want to call something
   * @param param The parameter to call with
   */
  @method
  async callMe(param: string): Promise<string> {
    return (this.b = 'callMeServer_' + param);
  }

  @writeMethod
  async callWriteMe(param: string): Promise<void> {
    this.b = 'callWriteMe_' + param;
  }

  @method
  async callObj(param: { a: string, b: number, c: Date }): Promise<Date> {
    return new Date();
  }

  @write
  shouldNotSave(): void {

  }
}