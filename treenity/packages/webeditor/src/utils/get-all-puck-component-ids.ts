/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { Data } from '@measured/puck';

const getAllPuckComponentIds = (data: Data) => {
  const zoneIds = Object.values(data.zones || {}).flatMap(zone => zone.map(item => item.props.id));
  const contentIds = data.content.map(i => i.props.id);
  return [...zoneIds, ...contentIds];
};
