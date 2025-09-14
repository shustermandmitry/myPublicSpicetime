import { PortsDescription } from '@treenity/core';
import { Obj } from '@treenity/js-shared/utils';
import * as noflo from 'noflo';
import { ComponentOptions } from 'noflo/lib/Component';
import { InPortsOptions, PortOptions } from 'noflo/lib/Ports';
import ProcessContext from 'noflo/lib/ProcessContext';
import ProcessInput from 'noflo/lib/ProcessInput';
import ProcessOutput from 'noflo/lib/ProcessOutput';

export interface ComponentWorker extends ComponentOptions {
  proc: (
    input: Obj<any>,
    context: ProcessContext,
    output: ProcessOutput,
  ) => Promise<any> | AsyncGenerator<any> | any;

  start?: () => void;
  metadata?: any;
}

const mapToNofloPorts = (ports: PortsDescription['in'], dir: 'in' | 'out') =>
  Object.fromEntries(
    Object.entries(ports || {})
      .map(([name, p]) => {
        const type = typeof p === 'string' ? p : p.type;
        const required = typeof p === 'string' ? true : p.required;

        if (type === 'dynamic') return [];
        let datatype = type === 'success' || type === 'complete' ? 'boolean' : type;
        datatype = type === 'error' ? 'object' : datatype;
        // const nameDir = camelToUnderscore(name) + '/' + dir;
        return [name, { datatype, required }];
      })
      .filter(x => x.length),
  );

export function toNofloPorts(ports: PortsDescription): ComponentOptions {
  return { inPorts: mapToNofloPorts(ports.in, 'in'), outPorts: mapToNofloPorts(ports.out, 'out') };
}

class NofloComponent extends noflo.Component {
  metadata: any;
}

export function createComponent(options: ComponentWorker): noflo.Component {
  const c = new NofloComponent(options);

  let proc: ComponentWorker['proc'];
  let cancelled = false;
  let inputRev = 0;
  c.metadata = options.metadata;
  c.start = async function (cb) {
    proc = options.proc;
    // proc = TNG((...args: [any, any, any]) => {
    //   const res: any = options.proc(...args);
    //   if (res?.[Symbol.asyncIterator]) res.next();
    //   return res;
    // });
    options.start?.call(this);

    cb?.(null);
  };
  const shutdown = c.shutdown;
  c.shutdown = async function (cb) {
    // proc.reset();
    cancelled = true;
    return shutdown.call(this, cb);
  };

  const inPorts = options.inPorts as InPortsOptions;
  const requiredPorts = Object.keys(inPorts).filter(
    name => (inPorts[name] as PortOptions).required,
  );

  const handle = async (input: ProcessInput, output: ProcessOutput, context: ProcessContext) => {
    // check all required ports set
    if (!requiredPorts.every(name => input.hasData(name))) return;

    // temporary collect all inputs to not read it twice
    const touched: Record<string, any> = {};
    const inputProxy = new Proxy(input, {
      has(target, name: string) {
        return target.hasData(name);
      },
      get(target, name: string) {
        // save touched value
        return name in touched ? touched[name] : (touched[name] = target.getData(name));
      },
    });

    try {
      const res = await proc(inputProxy, context, output);
      if (cancelled) return;

      const rev = ++inputRev;
      if (res != null) {
        if (res[Symbol.asyncIterator]) {
          for await (let val of res) {
            if (cancelled || inputRev !== rev) {
              res.return();
              return;
            }
            output.send(val);
          }
        } else if (res[Symbol.iterator]) {
          for (let val of res) {
            if (cancelled || inputRev !== rev) {
              res.return();
              return;
            }
            output.send(val);
          }
        } else if (typeof res === 'object') {
          output.send(res);
        }
        output.done();
      }
    } catch (err) {
      output.error(err as Error);
    }
  };

  c.process((input, output, context) => {
    handle(input, output, context);
  });

  return c;
}
