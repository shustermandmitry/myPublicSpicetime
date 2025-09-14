import React from 'react';

import { addComponent } from '../../tree';
import { TelegramUser } from './User.meta';

class TelegramUserComponent extends React.PureComponent {
  render() {
    console.log(this.props.value);
    const { firstName, lastName, username, tid, _tg } = this.props.value;
    return (
      <ul>
        <li>
          <b>Name:</b> {firstName} {lastName}
        </li>
        <li>
          <b>Alias:</b> @{username}
        </li>
        <li>
          <b>ID:</b> {tid}
        </li>
        <li>
          <b>Tags:</b> {_tg.join(', ')}
        </li>
      </ul>
    );
  }
}

addComponent(TelegramUserComponent, TelegramUser, 'react');
addComponent(TelegramUserComponent, TelegramUser, 'react edit');
