/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import Input from '@/components/input';
import Select from '@/components/select';
import { noSpaces, required } from '@/utils/validation-rules';
import FormItem from '@/widgets/form-item';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { Form } from 'antd';
import React, { FC, useMemo } from 'react';
import type { IFieldFormSettingsComponents, IFieldFormSettingsValue } from '../types';
import {
  CheckboxFormItems,
  InputFormItems,
  InputNumberFormItems,
  SelectFormItems,
  TextareaFormItems,
} from './customFormItems';
import FieldSelectOptions from './FieldSelectOptions';
import { COMPONENTS_OPTIONS } from './list';

export interface FieldsFormComponentProps {
  value: IFieldFormSettingsValue;
  onChange(value: IFieldFormSettingsValue): void;
  onCancel(): void;
}

const FieldsFormComponent: FC<FieldsFormComponentProps> = ({ value, onCancel, onChange }) => {
  const [form] = Form.useForm();
  const [showOptions, toggleShowOptions] = useToggle();

  const componentType = Form.useWatch('component', form) as IFieldFormSettingsComponents;

  const isShowPlaceholder = useMemo(
    () => !(componentType === 'checkbox' || componentType === 'switch'),
    [componentType],
  );

  const isShowOptions = useMemo(
    () => componentType === 'select' || componentType === 'segmented',
    [componentType],
  );

  const onCancelForm = () => {
    onCancel();
    form.resetFields();
  };

  const onSubmit = () => {
    form.validateFields().then(values => {
      onChange(values);
      onCancel();
    });
  };

  const formItemsComponent = useMemo(() => {
    switch (componentType) {
      case 'input': {
        return <InputFormItems />;
      }
      case 'inputNumber': {
        return <InputNumberFormItems />;
      }
      case 'select': {
        return <SelectFormItems />;
      }
      case 'segmented': {
        return <SelectFormItems />;
      }
      case 'checkbox':
      case 'switch': {
        return <CheckboxFormItems />;
      }
      case 'textarea': {
        return <TextareaFormItems />;
      }
    }
  }, [componentType]);

  return (
    <Root>
      <ScrollContainer>
        <FormStyled form={form} onFinish={onChange} initialValues={value}>
          <PanelItem label="Field">
            <FormItem name="component" rules={[required]}>
              <Select
                options={COMPONENTS_OPTIONS}
                placeholder="Component"
                size="x-small"
                style={{ width: '100%' }}
              />
            </FormItem>
          </PanelItem>
          <PanelItem label="Id">
            <FormItem name={['params', 'id']} rules={[noSpaces]}>
              <Input placeholder="Id" size="x-small" />
            </FormItem>
          </PanelItem>
          <PanelItem label="Label">
            <FormItem name={['params', 'label']}>
              <Input placeholder="Label text" size="x-small" />
            </FormItem>
          </PanelItem>
          <PanelItem label="Name">
            <FormItem name={['params', 'name']} rules={[required, noSpaces]}>
              <Input placeholder="Name text" size="x-small" />
            </FormItem>
          </PanelItem>
          {isShowPlaceholder && (
            <PanelItem label="Placeholder">
              <FormItem name={['params', 'placeholder']}>
                <Input placeholder="Placeholder text" size="x-small" />
              </FormItem>
            </PanelItem>
          )}
          {isShowOptions && (
            <FormItemStyle name={['params', 'options']} size="small" rules={[required]}>
              <FieldSelectOptions />
            </FormItemStyle>
          )}
          <Button
            size="x-small"
            block
            type="secondary-filled"
            suffix={
              <Icon name="arrow-bottom_outlined" color="primary" rotate={showOptions ? 180 : 0} />
            }
            onClick={toggleShowOptions}
          >
            More options
          </Button>
          {showOptions && formItemsComponent}
        </FormStyled>
      </ScrollContainer>
      <Buttons>
        <ButtonWithIcon
          type="secondary-filled"
          size="x-small"
          block
          color="primary"
          icon={<Icon name="x-axis_outlined" />}
          onClick={onCancelForm}
        >
          Cancel
        </ButtonWithIcon>
        <ButtonWithIcon
          type="primary"
          size="x-small"
          block
          icon={<Icon name="save_outlined" />}
          onClick={onSubmit}
        >
          Save
        </ButtonWithIcon>
      </Buttons>
    </Root>
  );
};

const FormItemStyle = styled(FormItem)`
  .ant-form-item-explain-error {
    bottom: -5px;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 4px;
  padding-top: 8px;

  button:first-of-type {
    i {
      color: ${p => p.theme.colorPrimary};
    }
  }
`;

const ScrollContainer = styled.div`
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Root = styled.div`
  width: 204px;
`;

const FormStyled = styled(Form<IFieldFormSettingsValue>)`
  display: flex;
  flex-direction: column;
  gap: 4px;

  & > div {
    margin-bottom: 0;
  }

  .ant-form-item {
    margin-bottom: 0;

    & .ant-form-item-control-input {
      min-height: initial;
    }
  }
`;

export default FieldsFormComponent;
