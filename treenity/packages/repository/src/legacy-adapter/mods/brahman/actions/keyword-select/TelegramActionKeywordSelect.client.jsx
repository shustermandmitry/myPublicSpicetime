import { Col, Input, Row } from 'antd';
import React from 'react';
import { addComponent } from '../../../../tree';
import { ArrayEditor } from '../../../../ui/components/ArrayEditor';
import TagEditor from '../../../../ui/components/TagEditor';
import { immer } from '../../../../utils/immer';
import { MetaEdit } from '../../../types/meta/MetaEdit';

import { addActionMenu } from '../addActionMenu';

import { KeywordAction, TelegramActionKeywordSelect } from './TelegramActionKeywordSelect.meta';

const KeywordEditor = ({ value, onChange }) => {
  const changeKeywords = kw =>
    onChange(
      immer(value, draft => {
        draft.keywords = kw;
      }),
    );
  const changeMessage = msg => {
    onChange(
      immer(value, draft => {
        draft.message = msg.target.value;
      }),
    );
  };

  return (
    <Row>
      <Col span={10}>
        <TagEditor initialValue={value.keywords} onChange={changeKeywords} />
      </Col>
      <Col span={14}>
        <Input.TextArea rows={1} value={value.message || ''} autoSize onChange={changeMessage} />
      </Col>
    </Row>
  );
};

addComponent(KeywordEditor, KeywordAction, 'react form');
addComponent(ArrayEditor, [KeywordAction], 'react form', {
  props: {
    valueType: KeywordAction,
    context: 'react form',
  },
});
addComponent(MetaEdit, TelegramActionKeywordSelect, 'react edit');
addActionMenu(TelegramActionKeywordSelect, 'nlp', 'Keyword select');
