/*
 * Copyright (c) 2024. Treenity Inc.
 */
import { metaType } from '@treenity/core';
import { entity, method } from '@treenity/entity';

export const EventType = metaType<EventEntity>('event-type');

@entity(EventType)
export class EventEntity {
  createdAt!: string;
  title!: string;
  suffix!: string;

  @method
  updateTitle(newTitle: string, suffix: string): Promise<string> {
    return undefined!;
  }
}
