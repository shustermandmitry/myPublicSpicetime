import Component from 'noflo-assembly';

class Hello extends Component {
  constructor() {
    super({
      description: 'Does lots of nice things',
      icon: 'science',
      inPorts: ['foo', 'bar'],
      outPorts: ['boo', 'baz'],
      validates: ['subitem.id'], // See Validation section below
    });
  }

  relay(msg, output) {
    msg.hello = 'Hello world!';
    output.sendDone(msg);
  }
}
