import { Data } from '@measured/puck';

export function getNestedComponentIds(rootId: string, data: Data): string[] {
  const ids: Set<string> = new Set();

  function traverse(id: string) {
    ids.add(id);
    Object.keys(data.zones || {}).forEach(zoneKey => {
      if (zoneKey.startsWith(`${id}:`)) {
        data?.zones?.[zoneKey]?.forEach(item => {
          ids.add(item.props.id);
          traverse(item.props.id);
        });
      }
    });
  }

  traverse(rootId);
  return Array.from(ids);
}
