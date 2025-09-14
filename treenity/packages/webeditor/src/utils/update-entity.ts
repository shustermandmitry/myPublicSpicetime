import { EntityImpl } from '@treenity/entity';

// TODO: temporary solution to update the entity. fix later.
export default function updateEntity<T>(entity: EntityImpl<T>, changes: Record<string, any>) {
  Object.entries(changes).forEach(([key, value]) => {
    entity[key as keyof EntityImpl<T>] = value;
    entity.$writePatch([
      {
        op: 'replace',
        path: `/${key}`,
        value: value,
      },
    ]);
  });
}
