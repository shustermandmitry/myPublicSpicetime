/*
 * Copyright (c) 2024. Treenity Inc.
 */

import BackgroundThemed, { backgroundDefaultValue } from '@/widgets/background-editor';
import type { BackgroundThemedValue } from '@/widgets/background-editor/types';
import BorderThemed, { BorderThemedValue } from '@/widgets/border-editor';
import CollapseContainer from '@/widgets/CollapseContainer';
import LayoutEditor, { layoutDefaultValue } from '@/widgets/layout-editor';
import type { LayoutThemedValue } from '@/widgets/layout-editor/types';
import type { PositionThemedValue } from '@/widgets/position-editor';
import PositionThemed from '@/widgets/position-editor';
import type { ShadowThemedValue } from '@/widgets/shadow-editor';
import ShadowThemed from '@/widgets/shadow-editor';
import type { SizeThemedValue } from '@/widgets/size-editor';
import SizeThemed from '@/widgets/size-editor';
import type { SpacingThemedValue } from '@/widgets/spacing-editor';
import SpacingThemed from '@/widgets/spacing-editor';
import TextPropsThemed from '@/widgets/text-editor';
import type { TextPropsThemedValue } from '@/widgets/text-editor/types';
import styled from '@emotion/styled';
import { merge } from '@s-libs/micro-dash';
import { Form } from 'antd';
import { FC, useCallback, useState } from 'react';
import FlexChild, { defaultFlexChild } from '../flex-child-editor';
import type { IFlexChildValue } from '../flex-child-editor/types';
import GridChildEditor, { defaultGridChild } from '../grid-children-editor';
import type { IGridChildEditorValue } from '../grid-children-editor/types';

interface IControlsProps {
  border: BorderThemedValue;
  layout: LayoutThemedValue;
  size: SizeThemedValue;
  background: BackgroundThemedValue;
  shadow: ShadowThemedValue;
  text: TextPropsThemedValue;
  position: PositionThemedValue;
  spacing: SpacingThemedValue;
  gridChild: IGridChildEditorValue;
  flexChild: IFlexChildValue;
}

const defaultValues: IControlsProps = {} as IControlsProps;

const initialValues = {
  layout: layoutDefaultValue,
  background: backgroundDefaultValue,
  gridChild: defaultGridChild,
  flexChild: defaultFlexChild,
};

const Styles: FC = () => {
  const [form] = Form.useForm();
  const [values, setValues] = useState<IControlsProps>(defaultValues);

  const onValuesChange = useCallback(
    (changedValues: Partial<IControlsProps>, allValues: IControlsProps) => {
      setValues(prevValues => {
        return merge({}, prevValues, allValues);
      });
    },
    [],
  );

  return (
    <FormStyled initialValues={initialValues} form={form} onValuesChange={onValuesChange}>
      <Container>
        <CollapseContainer title="Border">
          <Form.Item name="border">
            <BorderThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Layout">
          <Form.Item name="layout">
            <LayoutEditor />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Grid Child">
          <Form.Item name="grid_child">
            <GridChildEditor areas={values.layout?.gridSettings?.areas} />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Flex Child">
          <Form.Item name="flex_child">
            <FlexChild />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Size">
          <Form.Item name="size">
            <SizeThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Background">
          <Form.Item name="background">
            <BackgroundThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Shadow">
          <Form.Item name="shadow">
            <ShadowThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Text props">
          <Form.Item name="text">
            <TextPropsThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Position">
          <Form.Item name="position">
            <PositionThemed />
          </Form.Item>
        </CollapseContainer>
        <CollapseContainer title="Spacing">
          <Form.Item name="spacing">
            <SpacingThemed />
          </Form.Item>
        </CollapseContainer>
      </Container>
    </FormStyled>
  );
};

const FormStyled = styled(Form<IControlsProps>)`
  .ant-form-item .ant-form-item-control-input {
    min-height: initial;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${p => p.theme.colorBgPanel};
  width: 320px;
  user-select: none;
`;

export default Styles;
