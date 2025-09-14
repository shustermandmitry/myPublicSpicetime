/*
 * Copyright (c) 2024. Treenity Inc.
 */

export const FEATHERS_METHOD_CONTEXT = Symbol.for('FEATHERS_METHOD_CONTEXT');

function throwFunc(): any {
  throw new Error('No context found, are you in the entity method?');
}

export function getFeathersContext(entity: any) {
  return entity[FEATHERS_METHOD_CONTEXT] || throwFunc();
}
