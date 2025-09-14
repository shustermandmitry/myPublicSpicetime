/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { MetaScreenSizes, ScreenSize } from '@/constants/breakpoints';
import { metaScreenSizes } from '@/constants/breakpoints';
import { mergeNestedProps } from '@/utils/merge-responsive-props';
import { computedFn } from 'mobx-utils';

import { EntityImpl, writeMethod } from '@treenity/entity';
import { SharedProps } from '@/types';

type ResponsiveMeta<T extends Record<string, any>> = {
  [K in MetaScreenSizes]?: Partial<T>;
};

type EditorMetaType<Meta extends Record<string, any>> = Partial<Meta & SharedProps> &
  ResponsiveMeta<Meta & SharedProps>;

const screenSizeToMetaKey = (screen: ScreenSize) => `$:${screen}`;

export class EditorComponentMeta<Meta extends Record<string, any>> extends EntityImpl<Meta> {
  '$:sm': Partial<Meta> = {};
  '$:md': Partial<Meta> = {};
  '$:lg': Partial<Meta> = {};
  '$:xl': Partial<Meta> = {};
  '$:xxl': Partial<Meta> = {};

  // TODO: Fix that, extract-schemas goes into infinite loop, if this is  uncommented, currently here to satisfy typescript
  // $!: EntityMeta<Meta>;

  // TODO: Remove Later
  #isMetaInitialized: boolean = false;

  $getMergedOverrides = computedFn((screen: ScreenSize): Partial<Meta & SharedProps> => {
    const overrides = this.getAllOverrides();
    const defaultProps = this.getDefaultProperties();

    if (!overrides) {
      return defaultProps;
    }

    return mergeNestedProps(defaultProps, overrides, screen) as Partial<Meta & SharedProps>;
  });

  getDefaultProperties() {
    return Object.getOwnPropertyNames(this)
      .filter(
        prop =>
          !prop.startsWith('$') &&
          prop !== 'meta' &&
          typeof this[prop as keyof EditorComponentMeta<Meta>] !== 'function',
      )
      .reduce(
        (acc, curr) => ({ ...acc, [curr]: this[curr as keyof EditorComponentMeta<Meta>] }),
        {},
      );
  }

  @writeMethod
  setProperty(name: string, value: any) {
    if (!(name in this)) {
      console.error('Setting unknown property');
      return;
    }

    this[name as keyof typeof this] = value;
  }

  getAllOverrides() {
    const meta = this._getMeta();

    return Object.entries(meta).reduce(
      (acc, [key, value]) => {
        if (metaScreenSizes.includes(key as any)) {
          const formatedKey = key.replace('$:', '') as ScreenSize;
          // @ts-expect-error
          acc[formatedKey] = value;
        }
        return acc;
      },
      {} as Record<ScreenSize, Meta>,
    );
  }

  _getMeta() {
    //  TODO: Fix that, extract-schemas goes into infinite loop, if this is  uncommented, currently here to satisfy typescript
    if (!this.$.meta) {
      console.log(this);
      // @ts-ignore
      console.error('No meta found in entity ' + this.$name);
    }

    if (!this.#isMetaInitialized) {
      // @ts-ignore
      Object.keys(this?.$.meta || {}).forEach(meta => {
        if (meta.startsWith('$:')) {
          // @ts-ignore
          this[meta] = this.$.meta[meta];
        }
      });

      this.#isMetaInitialized = true;
    }

    return this as unknown as EditorMetaType<Meta>;
  }

  getOverride(screenSize: ScreenSize) {
    const metaScreenSizeKey = screenSizeToMetaKey(screenSize);
    const meta = this._getMeta();
    if (!(metaScreenSizeKey in meta)) {
      // @ts-ignore
      console.error(`No ${metaScreenSizeKey} found in ${this.name} entity metas `);
      return {};
    }
    return this._getMeta()?.[metaScreenSizeKey];
  }

  @writeMethod
  update(prop: string, value: any) {
    this[prop as keyof EditorComponentMeta<Meta>] = value;
  }

  @writeMethod
  addOverride(newMeta: Partial<{ [K in keyof Meta]: Meta[K] }>, screenSize: ScreenSize) {
    const metaScreenSizeKey = screenSizeToMetaKey(screenSize);

    if (metaScreenSizeKey in this) {
      Object.assign((this as any)[metaScreenSizeKey], newMeta);
    } else {
      (this as any)[metaScreenSizeKey] = newMeta;
    }
  }

  /**
   * So for instance we may want to remove the override of menu[0] all together,
   * for now this is used, when we want to remove
   * array items and we need to remove all the overrides for that array item
   * @param path - The path of the override to remove (e.g., 'menu[0]')
   */
  @writeMethod
  removeIndexedOverrides(path: string) {
    return Object.entries(this.getAllOverrides()).forEach(([screenSize, overrides]) => {
      Object.keys(overrides).forEach(override => {
        if (override.startsWith(path)) {
          this.removeOverride(override, screenSize as ScreenSize);
        }
      });
    });
  }

  @writeMethod
  removeOverride(prop: keyof Meta, screenSize: ScreenSize) {
    const metaScreenSizeKey = screenSizeToMetaKey(screenSize);

    if (metaScreenSizeKey in this) {
      const responsiveMeta = (this as unknown as EditorMetaType<Meta>)[metaScreenSizeKey];
      if (responsiveMeta && prop in responsiveMeta) {
        delete responsiveMeta[prop];
      }
    }
  }
}
