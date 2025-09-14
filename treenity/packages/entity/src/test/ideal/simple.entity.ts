import { metaType } from '@treenity/core';
import { method, write, writeMethod } from '../../decorators';
import { entity } from '../../entity-decorator';

// const { entity } = treenity;

// just simple type, should be added as schema maybe
export interface Look {
  hair: string;
  eyes: string;
}

/**
 * here just write simple type name, it will be prefixed with package type
 * schema will be named as `ideal.schema.json`
 */
export const MySimpleType = metaType<MySimple>('simple');

@entity(MySimpleType)
export class MySimple {
  name!: string;
  health!: number;
  age?: number;
  look?: Look;
  serverValue?: string = 'client';

  // remote method with optimistic implementation
  @writeMethod
  async changeAge(newAge: number): Promise<number | undefined> {
    this.age = newAge;
    return 0;
  }

  // remote method without optimistic implementation
  /**
   * @TJS-ignore
   */
  @method
  async sendEmail(param: { text: string }) {}

  // sendEmail = RemoteFunction<void, [{ text: string }]>();
  // @MySimpleType.method
  @write
  async heal(): Promise<void> {
    this.health = 100;
  }

  @method
  serverChange(newValue: string): Promise<string> {
    return null!;
  }
}
