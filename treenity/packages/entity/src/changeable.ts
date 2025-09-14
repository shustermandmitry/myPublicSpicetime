/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Operation } from 'fast-json-patch';

export interface ChangeableEntity<T> {
  update(obj: T): boolean;
  patch(obj: Operation[]): boolean;
}
