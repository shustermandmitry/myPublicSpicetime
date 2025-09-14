import Component from 'noflo-assembly';
import { NamedNode } from '../types/named-node/NamedNode.meta';

const getMeta = Meteor.bindEnvironment(function (instance, cb, onErr) {
  const metaID = instance.nodeId.split('_').at(-1);
  const node = NamedNode.findOneByMetaID(metaID);
  const meta = node.getMetaById(metaID);

  if (!meta) throw new Error('Meta not found', metaID);

  try {
    cb(meta);
  } catch (err) {
    onErr && onErr(err);
    throw err;
  }
});

class DummyComponent extends Component {
  constructor(className) {
    super({});
    this.className = className;
  }

  relay(msg, out) {
    console.warn(this.className, 'has no relay method, creating dummy component');
    return out.sendDone(msg);
  }
}

const dummyCreator = name => () => new DummyComponent(name);

const createMetaComponent = MetaType => {
  if (typeof MetaType === 'string' || !MetaType.definition.flo) {
    return dummyCreator(MetaType.className);
  }

  const { setUp, tearDown, relay, handle, ...flo } = MetaType.definition.flo;

  let metaRelay = relay;

  const dummy = !metaRelay && !handle;
  if (dummy) {
    console.warn((MetaType || {}).className, 'has no relay method, creating dummy component');
    return dummyCreator(MetaType.className);
  }

  const config = {
    ...flo,
    // description: `Meta: ${MetaType.schema.description || `${MetaType.className}, no description`}`,
    dummy,
  };

  class MetaComponent extends Component {
    static name = `NoFloMeta(${MetaType.className})`;

    constructor() {
      super(config);
    }
  }

  MetaComponent.prototype.setUp =
    setUp &&
    function (callback) {
      getMeta(this, meta => {
        setUp.call(meta, this);
        callback();
      });
    };

  MetaComponent.prototype.tearDown =
    tearDown &&
    function (callback) {
      // getMeta(this, meta => {
      //   tearDown.call(meta, this);
      //   callback();
      // })
    };

  if (relay) {
    MetaComponent.prototype.relay = function (msg, out) {
      getMeta(
        out.nodeInstance,
        meta => {
          if (typeof msg === 'string') {
            msg = JSON.parse(msg);
          }
          relay.call(meta, msg, out, this);
        },
        err => {
          console.error('Error in ', MetaComponent.className, 'relay', err);
          out.sendDone({ errors: [err] });
        },
      );
    };
  }

  if (handle) {
    MetaComponent.prototype.handle = function (input, output, metaData) {
      getMeta(
        input.nodeInstance,
        meta => handle.call(meta, input, output, metaData, this),
        err => {
          console.error('Error in ', MetaComponent.className, 'relay', err);
          output.sendDone({ errors: [err] });
        },
      );
    };
  }

  return data => {
    const c = new MetaComponent(data === true ? {} : data);
    return c;
  };
};

export default createMetaComponent;
