/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { createStorageStore } from '@treenity/ui-kit/store';

const tabs = ['layers', 'style', 'elements', 'settings', 'ai', 'theme'];
const elementsTabs = ['elements', 'layouts', 'templates', 'favourite'];

export type TabsProps = (typeof tabs)[number];
export type ElementsTabsProps = (typeof elementsTabs)[number];

// type SelectedItem = Data['content'][number] | null;

export interface PageEditor {
  activeRightTab: Partial<TabsProps>;
  activeLeftTab: Partial<TabsProps>;
  activeLeftElementsTab: Partial<ElementsTabsProps>;
  setActiveRightTab: (value: TabsProps) => void;
  setActiveLeftTab: (value: TabsProps) => void;
  setActiveLeftElementsTab: (value: ElementsTabsProps) => void;
}

export const createEditorStore = () =>
  createStorageStore<PageEditor, Omit<PageEditor, 'selectedItem'>>(
    {
      name: 'page-editor-store',
      // partialize({ selectedItem, ...state }) {
      //   return state;
      // },
    },
    set => {
      return {
        activeRightTab: 'style',
        activeLeftTab: 'elements',
        activeLeftElementsTab: 'elements',

        setActiveRightTab(value) {
          set(state => {
            state.activeRightTab = value;
          });
        },

        setActiveLeftElementsTab(value) {
          set(state => {
            state.activeLeftElementsTab = value;
          });
        },

        setActiveLeftTab(value) {
          set(state => {
            state.activeLeftTab = value;
          });
        },
      };
    },
  );
