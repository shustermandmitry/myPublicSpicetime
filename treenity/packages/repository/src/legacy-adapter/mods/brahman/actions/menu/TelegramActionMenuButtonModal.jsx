import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import TagEditor from '../../../../ui/components/TagEditor';
import { produce } from '../../../../utils/immer';
import { TStringComponent } from '../translate/TString.client';
import { ActionDropdown } from './addButtonActionMenu';

export default class TelegramActionMenuButtonModal extends React.Component {
  state = {
    button: this.props.button,
  };

  static getDerivedStateFromProps(props, currentState) {
    if (!currentState.button || currentState.button.id !== props.button.id) {
      return {
        button: props.button,
      };
    }
    return null;
  }

  handleOk = e => {
    this.props.saveButton(this.state.button);
    this.props.hideModal();
  };

  handleCancel = e => {
    this.props.hideModal();
  };

  delButton = () => {
    this.props.delButton(this.props.button.id);
    this.props.hideModal();
  };

  updateButton(func) {
    this.setState(({ button }) => ({
      button: produce(button, func),
    }));
  }

  onTags = tags =>
    this.updateButton(b => {
      b.tags = tags;
    });
  onUrl = evt => {
    const url = evt.target.value;
    this.updateButton(b => {
      b.url = url;
    });
  };

  changeTitle = title => {
    this.updateButton(b => {
      b.title = title;
    });
  };

  changeAction = act => {
    this.updateButton(b => {
      // debugger;
      b.action = act;
    });
  };

  onChangeAction = act => {
    // debugger;
    this.updateButton(b => {
      Object.assign(b.action, act);
    });
  };

  render() {
    const button = this.state.button;

    if (!button) return '';
    return (
      <>
        <Modal
          title={button.title.toString()}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="shrink-form"
          footer={
            <>
              <Button type="danger" onClick={this.delButton} style={{ float: 'left' }}>
                Delete
              </Button>
              <Button onClick={this.handleCancel}>Cancel</Button>
              <Button type="primary" onClick={this.handleOk}>
                OK
              </Button>
            </>
          }
          transitionName="none"
          maskTransitionName="none"
        >
          <Form.Item>
            <TagEditor initialValue={button.tags} onChange={this.onTags} />
          </Form.Item>
          <Form.Item label="Title">
            {/*<Input*/}
            {/*value={this.state.button.title}*/}
            {/*onChange={this.changeTitle}*/}
            {/*/>*/}
            <TStringComponent value={button.title} onChange={this.changeTitle} />
          </Form.Item>
          <Form.Item label="URL">
            <Input value={button.url} onChange={this.onUrl} />
          </Form.Item>
          <Form.Item label="Action">
            <ActionDropdown
              node={this.props.node}
              currentValue={button.action?._t}
              onChange={this.changeAction}
            />
          </Form.Item>

          {button.action && (
            <div className="modal-action">
              <RenderMeta
                key={button.action?._id}
                node={this.props.node}
                value={button.action}
                onChange={this.onChangeAction}
                context="react edit"
                autosave
              />
            </div>
          )}

          {/*<RenderMeta node={this.props.node} context="react edit" />*/}
        </Modal>
      </>
    );
  }
}
