import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const TestType = metaType<TestEntity>('webeditor.test');

@entity(TestType)
export class TestEntity {
  a!: string;
  b!: number;
}
