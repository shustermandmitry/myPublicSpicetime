import { metaType } from "@treenity/core";
import { entity, method, writeMethod } from "@treenity/entity";


export const TestEntityType = metaType<TestEntity>('test.entity');

@entity(TestEntityType)
export class TestEntity {
  a!: string;
  b!: number;
  c: boolean = true;

  @writeMethod
  async updateC(cValue: boolean, bValue?: number): Promise<void> {
    this.c = cValue;
    if (typeof bValue === 'number') {
      this.b = bValue;
    }
  }

  @method
  async getUpdated(): Promise<TestEntity> {
    return this;
  }
}