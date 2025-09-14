import { entity, method, writeMethod } from '../../decorators';

// just simple type, should be added as schema maybe
export interface Look {
  hair: string;
  eyes: string;
}

/**
 * here just write simple type name, it will be prefixed with package type
 * schema will be named as `ideal.entity.schema.json`
 */
@entity('ideal')
export class MyIdeal {
  name!: string;
  /**
   * @widget textArea
   */
  health!: number;
  /**
   * @format date-time
   * @minValue 0
   */
  age?: number;
  /**
   * @widget inner-value
   */
  look!: Look;

  // remote method with optimistic implementation
  @writeMethod
  async changeAge(newAge: number) {
    this.age = newAge;
  }

  // remote method without optimistic implementation
  /**
   * @TJS-ignore
   */
  @method
  sendEmail(param: { text: string }): Promise<boolean> {
    return undefined!;
  }

  // sendEmail = RemoteFunction<void, [{ text: string }]>();
}
