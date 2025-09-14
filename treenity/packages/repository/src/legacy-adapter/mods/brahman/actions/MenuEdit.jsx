import React from 'react';
import { Field } from '../../form/AstronomyForm';

import { MetaEdit } from '../../types/meta/MetaEdit';
import { TelegramActionMenu } from './menu/TelegramActionMenu.meta';

const T = TelegramActionMenu.Type;

export const MenuEdit = props => {
  const { value } = props;
  // XXX fix menu

  return (
    <>
      <MetaEdit {...props}>
        {[T.KEYBOARD, T.INLINE, T.INLINE_NEW, T.INLINE_CLOSE].includes(value.menuType) && (
          <Field name="rows" />
        )}
        {/*<Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="Menu">*/}
        {/*  <RenderMeta*/}
        {/*    type={TelegramActionMenu}*/}
        {/*    value={props.value}*/}
        {/*    onChange={props.onChange}*/}
        {/*    context={['react', 'form']}*/}
        {/*  />*/}
        {/*</Form.Item>*/}
      </MetaEdit>
    </>
  );
};
