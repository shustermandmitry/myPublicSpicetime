/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { enUS, Theme, ThemeEditor } from 'antd-token-previewer';
import { ThemeEditorMode } from 'antd-token-previewer/es/ThemeEditor';

import React, { FC, ReactNode, useState } from 'react';

export { Theme };

interface ThemeEditorComponent {
  value: Theme;
  onChange(theme: Theme): void;
  actions?: ReactNode;
  children?: ReactNode;
}

const ThemeEditorComponent: FC<ThemeEditorComponent> = ({ value, onChange, actions, children }) => {
  const [advanced, setAdvanced] = useState(true);
  const [mode, setMode] = useState<ThemeEditorMode>('global');

  return (
    <ThemeEditor
      theme={value}
      onThemeChange={onChange}
      locale={enUS}
      advanced={advanced}
      onAdvancedChange={setAdvanced}
      mode={mode}
      onModeChange={setMode}
      actions={actions}
      children={children}
    />
  );
};

export default ThemeEditorComponent;
