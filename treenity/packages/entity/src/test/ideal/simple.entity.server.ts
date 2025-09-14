import { method, write } from '../../decorators';
import { entity } from '../../entity-decorator';
import { MySimple, MySimpleType } from './simple.entity';

// just simple type, should be added as schema maybe
export interface Look {
  hair: string;
  eyes: string;
}

/**
 * here just write simple type name, it will be prefixed with package type
 * schema will be named as `ideal.schema.json`
 */
@entity(MySimpleType, 'server')
export class MySimpleServer extends MySimple {
  serverValue: string = 'server';

  // remote method with optimistic implementation
  @write
  @method
  async changeAge(newAge: number) {
    const prev = this.age;
    this.age = newAge;
    return prev;
  }

  // remote method without optimistic implementation
  /**
   * @TJS-ignore
   */
  @method
  async sendEmail(param: { text: string }) {}

  // sendEmail = RemoteFunction<void, [{ text: string }]>();
  @write
  @method
  async heal(): Promise<void> {
    this.health = 100;
  }

  @write
  @method
  async serverChange(newValue: string) {
    const prev = this.serverValue;
    this.serverValue = newValue;
    return prev;
  }
}
