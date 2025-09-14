/*
 * Copyright (c) 2024. Treenity Inc.
 */
import { DEFAULT_SCREEN_SIZE, sizeBreakpointsInPixels } from '@/constants';
import type { ComponentSchema } from '@/types/component-schema';
import { SerializedNodes } from '@craftjs/core';

import { metaType } from '@treenity/core';
import { entity, writeMethod } from '@treenity/entity';

export const WebEditorType = metaType<WebEditorEntity>('layout.webeditor');

@entity(WebEditorType)
export class WebEditorEntity {
  layout: SerializedNodes = DEFAULT_CRAFT_STATE;
  panelWidth: number = sizeBreakpointsInPixels[DEFAULT_SCREEN_SIZE];
  autoSave: boolean = false;
  edit: boolean = false;
  zoom: { value: number; label: string } = { value: 1, label: '100%' };
  autoZoom: boolean = false;
  height: number = 0;
  prefabs: Record<string, ComponentSchema> = {};

  @writeMethod
  setAutoSave(autoSave: boolean | ((prevValue: boolean) => boolean)) {
    if (typeof autoSave === 'function') {
      this.autoSave = autoSave(this.autoSave);
      return;
    }
    if (typeof autoSave === 'boolean') {
      this.autoSave = autoSave;
      return;
    }
    console.error('typeof autoSave:', typeof autoSave);
    console.error(`Wrong type of value: ${autoSave} passed to setAutoSave`);
  }

  @writeMethod
  addPrefab(name: string, prefab: ComponentSchema) {
    this.update({ prefabs: { ...(this.prefabs || {}), [name]: prefab } });
  }

  removePrefab(name: string) {
    delete this.prefabs[name];
  }

  @writeMethod
  update(data: Partial<WebEditorEntity>) {
    Object.assign(this, data);
  }

  @writeMethod
  updateLayout(layout: SerializedNodes) {
    this.layout = layout;
  }

  @writeMethod
  setDefaultLayout() {
    this.layout = DEFAULT_CRAFT_STATE;
  }
}

export const DEFAULT_CRAFT_STATE: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: 'root',
    },
    isCanvas: true,
    props: {},
    displayName: 'Container',
    custom: {},
    parent: null,
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
};
