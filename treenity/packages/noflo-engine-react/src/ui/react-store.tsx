import * as React from 'react';
import { ChangeEventHandler, PropsWithChildren } from 'react';
import { addReactNoflo } from '../add-react-noflo';

addReactNoflo(
  'ui.button',
  ({ title, onClick, children }: PropsWithChildren<{ title: string; onClick: () => void }>) => (
    <button onClick={onClick}>{title || children}</button>
  ),
  {
    props: { children: 'Click Me' },
    ports: {
      in: { title: 'string' },
      out: { onClick: 'object' },
    },
  },
);

addReactNoflo(
  'ui.output',
  ({ text }: { text: string }) => {
    return (
      <div>
        Here is some string text
        <pre>{text}</pre>
      </div>
    );
  },
  {
    ports: {
      in: { text: 'string' },
      out: {},
    },
  },
);

addReactNoflo(
  'ui.number',
  ({ setNumber }: { setNumber: (val: number) => void }) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = evt => {
      const num = +evt.target.value;
      console.log('setting number', num);
      setNumber(num);
    };
    return (
      <div>
        Update number to send it to port
        <input type="number" onChange={onChange} />
      </div>
    );
  },
  {
    ports: {
      in: {},
      out: { setNumber: 'number' },
    },
  },
);

addReactNoflo(
  'ui.string',
  ({ setString }: { setString: (val: string) => void }) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = evt => {
      const value = evt.target.value;
      console.log('setting string', value);
      setString(value);
    };
    return (
      <div>
        Update string to send it to port
        <input onChange={onChange} />
      </div>
    );
  },
  {
    ports: {
      in: {},
      out: { setString: 'string' },
    },
  },
);

addReactNoflo(
  'react-connected',
  ({ from, to, onClick }: { from: string; to: string; onClick: (val: any) => void }) => (
    <div>
      <pre>from: {from}</pre>
      <pre>to: {to}</pre>
      <button onClick={evt => onClick({ sum: from + to })}>Send signal</button>
    </div>
  ),
  {
    ports: {
      in: {
        from: 'number',
        to: 'number',
      },
      out: { onClick: 'object' },
    },
  },
);
