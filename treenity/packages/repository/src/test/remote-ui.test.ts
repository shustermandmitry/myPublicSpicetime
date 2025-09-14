/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { createEndpoint, MessageEndpoint } from '@remote-ui/rpc';
import EventEmitter from 'node:events';

global.console = require('console');

class Transport extends EventEmitter implements MessageEndpoint {
  postMessage(message: any, transferables?: Transferable[]): void {
    console.log('message', JSON.stringify(message, null, 2));
    this.emit('post', message, transferables);
  }

  addEventListener(event: 'message', listener: (event: MessageEvent) => void): void {
    this.on('message', listener);
  }

  removeEventListener(event: 'message', listener: (event: MessageEvent) => void): void {
    this.off('message', listener);
  }

  terminate() {
    this.removeAllListeners();
  }
}

function connect(from: Transport, to: Transport): Transport {
  from.on('post', data => to.emit('message', { data }));
  return from;
}

describe.skip('remote-ui test calling', () => {
  test('simple endpoint', async () => {
    const t1 = new Transport();
    const t2 = new Transport();

    const endpoint1 = createEndpoint(connect(t1, t2));
    const endpoint2 = createEndpoint(connect(t2, t1));

    const helloData = {
      $id: 'test-event-id',
      $type: 'event',
      test: 5,
      some: {
        testMe(param: any, cb: any) {
          console.log('testMe', param);
          cb('all goods');
        },
      },
      willBeCalled(yes: any) {
        console.log('willBeCalled', yes);
      },
    };

    const api = {
      hello(name: string) {
        console.log('hello', name);
        return helloData;
      },
    };
    endpoint1.expose(api);

    const toCall = await (endpoint2.call as typeof api).hello('world');
    const toCall2 = await (endpoint2.call as typeof api).hello('world');
    await (toCall as any).willBeCalled('GREAT');
    await (toCall as any).some.testMe('you', (result: string) => {
      console.log('result of testMe', result);
    });
    console.log('toCall.test', toCall.test);
  });
});
