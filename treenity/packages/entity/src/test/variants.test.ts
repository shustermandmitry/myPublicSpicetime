import { metaType } from '@treenity/core';
import { Entity, EntityActions } from '../entity';
import { entity } from '../entity-decorator';
import { EntityManager } from '../entity-manager';
import { VARIANT_PREFIX } from '../variants';

export const OverrideType = metaType<Override>('override');

@entity(OverrideType)
class Override {
  name!: string;
  age!: number;
}

let overrideEntity: Entity<Override>;
let manager: EntityManager;
let actions: EntityActions<any>;
const entityData = {
  $id: 'id',
  $type: 'override',
  name: 'test',
  age: 24,
};

describe('client entity', () => {
  beforeEach(async () => {
    manager = new EntityManager('client');
    actions = {
      init: jest.fn(),
      patch: jest.fn(),
      subscribe: jest.fn(),
      execute: jest.fn(),
    };
    overrideEntity = await manager.ensure(entityData, actions, OverrideType);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('can add and remove overrides', async () => {
    overrideEntity.$.addVariantOverride('mobile', { name: 'hello' });
    overrideEntity.$.addVariantOverride('desktop', { age: 44 });

    // Wait for patch manager to process
    jest.runAllTimers();

    const json = JSON.parse(JSON.stringify(overrideEntity));
    expect(json).toHaveProperty(VARIANT_PREFIX + 'mobile', { name: 'hello' });
    expect(json).toHaveProperty(VARIANT_PREFIX + 'desktop', { age: 44 });
    expect(overrideEntity.$.getVariant('mobile')).toEqual({ name: 'hello' });
    expect(overrideEntity.$.getVariant('desktop')).toEqual({ age: 44 });

    overrideEntity.$.removeVariantOverride('mobile', 'name');

    // Wait for patch manager to process
    jest.runAllTimers();

    expect(overrideEntity.$.getVariant('mobile')).toEqual({});
    expect(overrideEntity.$.getVariant('desktop')).toEqual({ age: 44 });
  });

  test('get overrides', async () => {
    expect(overrideEntity.$.getVariant('mobile')).toEqual(undefined);

    overrideEntity.$.addVariantOverride('mobile', { name: 'hello' });

    // Wait for patch manager to process
    jest.runAllTimers();

    expect(overrideEntity.$.getVariant('mobile')).toEqual({ name: 'hello' });
  });
});
