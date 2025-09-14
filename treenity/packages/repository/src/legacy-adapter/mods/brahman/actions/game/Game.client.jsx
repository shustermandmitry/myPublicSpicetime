import { Card } from 'antd';
import React from 'react';

import { addComponent } from '../../../../tree';
import { Game } from './Game.meta';

class GameComponent extends React.PureComponent {
  render() {
    // const {firstName, lastName, username, tid} = this.props.value;

    const { menuId, data } = this.props.value;

    return (
      <div>
        <p>
          Game {menuId}
          <br />
          {data
            .slice()
            .reverse()
            .map((d, i) => (
              <Card bodyStyle={{ padding: 5 }} key={i}>
                {`Created at: ${d.createdAt.toLocaleDateString()} ${d.createdAt.toLocaleTimeString()}`}
                <br />
                Buttons:
                <div style={{ paddingLeft: 10 }}>
                  {d.buttons.map(b => (
                    <p style={{ color: b.isPushed ? 'green' : 'red' }}>{b.name}</p>
                  ))}
                </div>
              </Card>
            ))}
        </p>
      </div>
    );
  }
}

addComponent(GameComponent, Game, 'react');
addComponent(GameComponent, Game, 'react edit');
