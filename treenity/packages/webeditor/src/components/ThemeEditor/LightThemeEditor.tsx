import styled from '@emotion/styled';
import { ColorPicker } from '@treenity/admin-components/components';
import { CollapseContainer, InputWithUnits, PanelItem } from '@treenity/admin-components/widgets';
import { Form } from 'antd';
import { SeedToken } from 'antd/es/theme/interface';
import React, { useContext } from 'react';
import { EditorThemeContext } from './EditorThemeProvider';

interface _ThemeFields {
  input: string;
  label: string;
  field: keyof SeedToken;
}

type ThemeFields = _ThemeFields;

const fields: ThemeFields[] = [
  {
    label: 'Color Primary',
    input: 'colorPicker',
    field: 'colorPrimary',
  },
  {
    label: 'Color Success',
    input: 'colorPicker',
    field: 'colorSuccess',
  },
  {
    label: 'Color Warning',
    input: 'colorPicker',
    field: 'colorWarning',
  },
  { label: 'Color Error', input: 'colorPicker', field: 'colorError' },
  { label: 'Color Info', input: 'colorPicker', field: 'colorInfo' },
  {
    label: 'Color BG base',
    input: 'colorPicker',
    field: 'colorBgBase',
  },
  { label: 'Color Text', input: 'colorPicker', field: 'colorTextBase' },
  { label: 'Border radius', input: 'inputWithUnits', field: 'borderRadius' },
];

const Theme: React.FC = () => {
  // const { layout, config } = useLayout();
  const { seed, changeSeed } = useContext(EditorThemeContext);
  // const theme = useTheme() as any;

  // const makeUpdater = (fieldName: string) => (value: string) => {
  //   console.log('fieldName', fieldName, value);
  //   themeContext.onChange?.(fieldName, value);
  //   // layout.updateTheme({
  //   //   [fieldName]: value,
  //   // });
  // };
  //
  return (
    <Form>
      <Root>
        <CollapseContainer title="Theme" isOpen>
          {fields.map(field => (
            <PanelItem key={field.label} label={field.label}>
              {field.input === 'colorPicker' && (
                // @ts-ignore
                <ColorPicker
                  size="small"
                  value={seed[field.field] as string}
                  onChange={(color, css) => {
                    changeSeed({ [field.field]: color.toHexString() });
                  }}
                />
              )}
              {field.input === 'inputWithUnits' && (
                <InputWithUnits
                  size="small"
                  value={seed[field.field].toString() as string}
                  onChange={value => changeSeed({ [field.field]: value })}
                />
              )}
            </PanelItem>
          ))}
        </CollapseContainer>
      </Root>
    </Form>
  );
};

const Root = styled.div``;

export default Theme;
