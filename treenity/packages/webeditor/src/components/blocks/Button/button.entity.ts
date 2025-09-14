/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { ButtonProps } from './types';
import { Styles } from '@/types/styles';

export const ButtonType = metaType<ButtonEntity>('basic.button');

@entity(ButtonType)
export class ButtonEntity {
  label: ButtonProps['label'] = 'Get Started';
  styles: Styles = {
    spacing: {
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      padding: {
        top: '8px',
        right: '20px',
        bottom: '8px',
        left: '20px',
      },
    },
    position: DEFAULT_STYLES.position,
    textEditor: {
      ...DEFAULT_STYLES.textEditor,
      color: '#FFFFFF',
    },
    size: DEFAULT_STYLES.size,
    background: {
      backgroundColor: '#25AF60',
      backgroundSize: 'auto',
      backgroundImage: undefined,
    },
    border: {
      ...DEFAULT_STYLES.border!,
      radius: {
        topLeft: '8px',
        topRight: '8px',
        bottomLeft: '8px',
        bottomRight: '8px',
      },
    },
    /*

    **/
    shadow: DEFAULT_STYLES.shadow,
  };
}
