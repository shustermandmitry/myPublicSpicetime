const TestComponent = {
  getComponent() {
    const c = new noflo.Component();
    c.inPorts.add('in', {
      datatype: 'all',
    });
    c.outPorts.add('out', {
      datatype: 'all',
    });
    c.process((input, output) => {
      console.log('TEST', input);
      output.send({
        out: 'TEST',
      });
      output.done();
    });

    return c;
  },
};

export default TestComponent;
