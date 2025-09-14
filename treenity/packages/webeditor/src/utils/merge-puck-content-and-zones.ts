/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { ComponentData, Data } from '@measured/puck';

export const mergePuckContentAndZones = (data: Data) => {
  const zones = Object.values(data.zones || {}).reduce(
    (acc, zoneItems) => {
      zoneItems.forEach(item => {
        if (!item) return;
        acc[item.props.id] = item;
      });
      return acc;
    },
    {} as Record<string, ComponentData>,
  );

  return {
    ...data.content,
    ...zones,
  };
};
