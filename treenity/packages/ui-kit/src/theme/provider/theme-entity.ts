/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { metaType } from '@treenity/core';
import { entity, writeMethod } from '@treenity/entity';
import { MergedConfig, Theme, ThemeConfig } from '../types';

@entity('theme')
export class ThemeEntity implements Theme {
  name!: string;
  config!: ThemeConfig;

  get key() {
    return this.name;
  }

  @writeMethod
  setConfig(config: MergedConfig) {
    this.config = config;
  }
}
