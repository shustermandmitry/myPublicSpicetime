import { entity, method, write, writeMethod } from '../decorators';

@entity('no-type-var-entity')
export class TestEntityClient {
  a: number = 0;
  b: string = 'def';
  c!: Date;
  d?: boolean;
  e?: string;

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

  @method
  async callObj(param: { a: string, b: number, c: Date }): Promise<Date> {
    return new Date();
  }
}

