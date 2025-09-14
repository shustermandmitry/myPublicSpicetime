/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { EventEntity, EventType } from '@/test/shared/event.entity';
import { entity, writeMethod } from '@treenity/entity';

@entity(EventType.server)
class EventEntityServer extends EventEntity {
  @writeMethod
  async updateTitle(newTitle: string, suffix: string): Promise<string> {
    this.title = newTitle;
    this.suffix = suffix;
    return 'ok';
  }
}
