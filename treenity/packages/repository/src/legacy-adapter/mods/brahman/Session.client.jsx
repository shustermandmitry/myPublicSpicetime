import { map } from '@s-libs/micro-dash';
import React from 'react';

import { addComponent } from '../../tree';
import { TelegramSession } from './Session.meta';

function TelegramSessionComponent({ value }) {
  return (
    <>
      <h5>Session</h5>
      <ul>
        {map(value.data, (v, k) => (
          <li key={k}>
            <b>{k}:</b> {JSON.stringify(v)}
          </li>
        ))}
      </ul>
    </>
  );
}

addComponent(TelegramSessionComponent, TelegramSession, 'react');
addComponent(TelegramSessionComponent, TelegramSession, 'react edit');
