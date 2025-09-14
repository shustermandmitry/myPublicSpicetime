import { CloseCircleOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, Table, Tabs } from 'antd';
import React, { useState } from 'react';
import { addComponent } from '../../../tree';
import addToolbarMenu from '../../../tree/ui/create-meta/addToolbarMenu';
import withTracker from '../../../ui/utils/withTracker';
import { MetaEdit } from '../../types/meta/MetaEdit';

import { BotTranslate } from './BotTranslate.meta';
import { collectStrings } from './collect';

const TextEditor = ({ value, onChange }) => {
  const [edit, setEdit] = useState(false);
  const [current, setValue] = useState(value);

  const cancel = () => {
    setEdit(false);
  };
  const save = () => {
    setEdit(false);
    onChange(current);
  };

  return edit ? (
    <>
      <Input.TextArea autoSize value={current} onChange={evt => setValue(evt.target.value)} />
      <Button type="icon" onClick={save} icon={<SaveOutlined />} />
      <Button type="icon" onClick={cancel} icon={<CloseCircleOutlined />} />
    </>
  ) : (
    <>
      {value} <Button type="icon" onClick={() => setEdit(true)} icon={<EditOutlined />} />
    </>
  );
};

const TranslateTable = ({ value, onChange, strings, editString }) => {
  const [lang, setLang] = useState('en');

  const langs = value.lang.split(',');

  const save = string => text => {
    editString(string.path, lang, text);
  };

  const columns = lang => [
    {
      title: 'ru',
      dataIndex: 'ru',
      render: text => text,
      width: '50%',
    },
    {
      title: lang,
      dataIndex: lang,
      render: (text, string) => <TextEditor value={text} onChange={save(string)} />,
      width: '50%',
    },
  ];

  return (
    <Tabs activeKey={lang} onChange={setLang}>
      {langs.map(lang => (
        <Tabs.TabPane tab={lang} key={lang}>
          {lang === lang && (
            <Table
              styles={{ width: '100%' }}
              dataSource={strings}
              columns={columns(lang)}
              rowKey="path"
              pagination={false}
            />
          )}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

const TranslateData = withTracker(({ value }, onData) => {
  const { lang } = value;

  const node = value.node();
  const strings = collectStrings(node);

  const editString = (path, lang, text) => {
    return value.saveTranslation(path, lang, text);
  };

  onData({
    strings,
    editString,
  });
})(TranslateTable);

addComponent(TranslateData, BotTranslate, 'react');
addComponent(MetaEdit, BotTranslate, 'react edit');
addToolbarMenu(BotTranslate, 'telegram', 'BotTranslation');
