// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-empty-object-type */

import { useLayout } from '@/context/LayoutContext';
import { useEntity } from '@/hooks/use-entity';
import { CustomField, FieldProps } from '@/types/fields';
import {
  BackgroundEditor,
  BorderEditor,
  LayoutEditor,
  PositionEditor,
  ShadowEditor,
  SizeEditor,
  SpacingEditor,
  TextEditor,
} from '@treenity/admin-components/widgets';
import type { Node } from '@treenity/core';
import { observer } from 'mobx-react-lite';
import { useThrottledCallback } from 'use-debounce';
import ArrayField from './Array';

import CheckboxField from './Checkbox';
import EmptyField from './Empty';
import ImageUpload from './ImageUpload';
import ImageUploadInput from './ImageUploadInput';
import NumberField from './Number';
import RadioField from './Radio';
import SelectField from './Select';
import SelectIconField from './SelectIcon';
import addReactWidget from './shared/add-react-widget';
import { useCustomField } from './shared/hooks/use-custom-field';
import TextField from './Text';
import TextAreaField from './TextArea';

type WidgetComponentType<T extends P | Partial<P>, P> = React.FC<{
  value?: P;
  onChange?: (value: T) => void;
  field: CustomField & FieldProps;
  entity: ReturnType<typeof useEntity>['entity'];
  name: string;
  node: Node;
}>;

export const WidgetWrapper = <T extends P | Partial<P>, P>(Component: WidgetComponentType<T, P>) =>
  observer(
    ({
      value,
      name,
      onChange: _onChange,
      field,
    }: {
      field: CustomField & FieldProps;
      name: string;
      value: P;
      onChange: (value: T) => void;
      readOnly?: boolean;
    } & P) => {
      const { handleChange, localValue, entity } = useCustomField({ name, value });
      const { node } = useLayout();

      const throttledHandleChange = useThrottledCallback((value: T) => {
        handleChange(value);
      }, 200);

      return (
        <Component
          value={localValue}
          onChange={throttledHandleChange}
          field={field}
          entity={entity}
          node={node}
          name={name}
        />
      );
    },
  );

export const WIDGET_COMPONENTS = {
  'treenity.imageUpload': ImageUpload,
  'treenity.imageUploadInput': ImageUploadInput,
  'treenity.radio': RadioField,
  'treenity.selectIcon': SelectIconField,
  'treenity.text': TextField,
  'treenity.select': SelectField,
  'treenity.textarea': TextAreaField,
  'treenity.number': NumberField,
  'treenity.checkbox': CheckboxField,
  'treenity.empty': EmptyField,
  'treenity.array': ArrayField,
  'treenity.size': WidgetWrapper(SizeEditor),
  // @ts-ignore
  'treenity.shadow': WidgetWrapper(ShadowEditor),
  'treenity.border': WidgetWrapper(BorderEditor),
  'treenity.position': WidgetWrapper(PositionEditor),
  'treenity.layout': WidgetWrapper(LayoutEditor),
  'treenity.textEditor': WidgetWrapper(TextEditor),
  'treenity.background': WidgetWrapper(BackgroundEditor),
  'treenity.spacing': WidgetWrapper(SpacingEditor),
} as const;

export type IWidgetKeys = keyof typeof WIDGET_COMPONENTS;

export const WIDGETS_MAP = {
  IMAGEUPLOAD: 'treenity.imageUpload',
  IMAGEUPLOADINPUT: 'treenity.imageUploadInput',
  SELECTLINK: 'treenity.selectLink',
  RADIO: 'treenity.radio',
  TEXT: 'treenity.text',
  SELECT: 'treenity.select',
  SELECTICON: 'treenity.selectIcon',
  TEXTAREA: 'treenity.textarea',
  NUMBER: 'treenity.number',
  CHECKBOX: 'treenity.checkbox',
  EMPTY: 'treenity.empty',
  SPACING: 'treenity.spacing',
  SIZE: 'treenity.size',
  BACKGROUND: 'treenity.background',
  LAYOUT: 'treenity.layout',
  TEXTEDITOR: 'treenity.textEditor',
  SHADOW: 'treenity.shadow',
  BORDER: 'treenity.border',
  POSITION: 'treenity.position',
  ARRAY: 'treenity.array',
} as Record<string, string>;

Object.entries(WIDGET_COMPONENTS).forEach(([key, component]) => addReactWidget(key, component));
