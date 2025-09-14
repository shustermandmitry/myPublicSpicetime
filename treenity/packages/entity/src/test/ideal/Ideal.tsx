import { chainCall } from '@treenity/call-chain';
import { types } from '@treenity/core';
import { MyIdeal } from './ideal.entity';
import { MailServiceType } from './mail-service.entity';
import '@treenity/call-chain';
import { SEC, spreadComponent } from './react-types';

export const IdealComponent: SEC<MyIdeal> = ({ node, age, health }) => {
  const { value: mail, isLoaded } = node.get(MailServiceType).use();

  return (
    <div>
      IdealComponent
      <h3>
        {'test'} {mail?.server}
        <button onClick={() => mail?.sendEmail({ name: 'test@test.ru', text: 'test' })}>
          Send Email
        </button>
      </h3>
    </div>
  );
};

types.react.add(MyIdeal, spreadComponent(IdealComponent), {});
