import { Link } from '@remix-run/react';
import { last } from '@s-libs/micro-dash';
import { Button, Cascader, Input, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { addComponent } from '../../../../tree';
import { useCurrentNode } from '../../../../tree/base/CurrentNodeContext';
import { useToggle } from '../../../../ui/utils/useBoolean';
import useTracker from '../../../../ui/utils/useTracker';
import { MetaEdit } from '../../../types/meta/MetaEdit';
import { BotPage } from '../../page/Page.meta';

import { addActionMenu } from '../addActionMenu';
import { addButtonActionMenu } from '../menu/addButtonActionMenu';
import {
  TelegramActionActionPage,
  TelegramActionPage,
  TelegramActionPageWithUser,
} from './TelegramActionPage.meta';

const filter = (inputValue, path) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};
const search = { filter };

function TelegramActionPageSelectorComponent({ extra: { node }, value, onChange, opened }) {
  const [, setCurrent] = useCurrentNode();
  const [pages, options] = useTracker(() => {
    const botNode = node.findAllParents({ '_m._t': 'tg.telegram' })[0] || node;
    const pages = botNode.findChild({ name: 'pages' });
    const options = pages.findChildren().map(buildOptions);

    return [pages, options];
  }, [node]);

  const val = useMemo(() => buildValue(pages, value), [pages, value]);
  const change = useCallback(
    val => {
      onChange(last(val));
    },
    [onChange],
  );

  const onLink = e => {
    e.preventDefault();
    setCurrent(value);
  };

  return (
    <>
      <Cascader
        popupVisible={opened}
        options={options}
        value={val}
        onChange={change}
        allowClear={true}
        showSearch={search}
      />
      &nbsp;
      {value && (
        <Link to="#" onClick={onLink}>
          Go to page
        </Link>
      )}
      {/*<Form.Item label="Choose page">*/}
      {/*  <RenderMeta*/}
      {/*    type={Link}*/}
      {/*    value={value.page}*/}
      {/*    context="react form"*/}
      {/*  />*/}
      {/*</Form.Item>*/}
    </>
  );
}

const ShowPage = styled(Input)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ModalPageComponent = ({ value, ...props }) => {
  const [show, toggleShow] = useToggle();
  const [, setCurrent] = useCurrentNode();

  return (
    <>
      <ShowPage
        value={value}
        readOnly
        addonAfter={
          <Button type="primary" onClick={toggleShow}>
            Select...
          </Button>
        }
      />
      {show && (
        <Modal visible={true} onCancel={toggleShow}>
          <TelegramActionPageSelectorComponent value={value} opened={true} {...props} />
        </Modal>
      )}
    </>
  );
};

export const TelegramActionPageComponent = ModalPageComponent;

const buildOptions = node => {
  const children = node.findChildren();
  const has = !!children.length;

  const pages =
    has &&
    node.getMetasInherited(BotPage).map(({ _id, name }) => {
      return {
        value: node._id,
        label: node.name,
      };
    });

  return {
    value: node._id,
    label: node.name,
    // disabled: children.length + pages.length === 0,
    children: has ? pages.concat(children.map(buildOptions)) : undefined,
  };
};

const buildValue = (pages, val) => {
  if (!val) return undefined;
  const value = [val];
  const tree = pages.findAllChildren();

  const node = pages.findChildDeep({ _id: val });

  const build = v => {
    const node = tree.find(n => n._id === v);
    if (node) {
      value.unshift(v);
      if (tree.find(n => n._id === node._p)) {
        build(node._p);
      }
    }
  };
  if (node) build(node._id);
  return value;
};

TelegramActionPage.extend({
  fields: {
    nodeId: {
      type: String,
      form: {
        label: 'Page',
        component: TelegramActionPageComponent,
      },
    },
  },
});

// addComponent(TelegramActionPageComponent, TelegramActionPage, 'react form');
addComponent(MetaEdit, TelegramActionPage, 'react edit');
addActionMenu(TelegramActionPage, '', 'Page');
addButtonActionMenu(TelegramActionPage, '', 'Page');

addComponent(MetaEdit, TelegramActionPageWithUser, 'react edit');
addActionMenu(TelegramActionPageWithUser, '', 'Page with User context');

addComponent(MetaEdit, TelegramActionActionPage, 'react edit', {
  props: {
    fields: {
      action: true,
      nodeId: true,
    },
  },
});
addButtonActionMenu(TelegramActionActionPage, '', 'Action + Page');
