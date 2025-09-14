import React from 'react';

export class TelegramBotComponent extends React.PureComponent {
  render() {
    const { token, alias, name } = this.props.value;
    return (
      <div>
        <h1>{name}</h1>
        <p>
          alias: {alias}
          <br />
          token: {token}
        </p>
      </div>
    );
  }
}
