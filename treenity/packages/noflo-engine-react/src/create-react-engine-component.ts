import { PortsDescription } from '@treenity/core';
import { dashToCamel, mapObj, Obj } from '@treenity/js-shared/utils';
import { createComponent, toNofloPorts } from '@treenity/noflo-engine';
import { Component, InPort, OutPort } from 'noflo';

const cleanPortName = (name: string) => dashToCamel(name.split('/')[0]);

export function getPortsValues(component: Component) {
  const values: Obj<any> = {};
  mapObj(component.inPorts.ports as Record<string, InPort>, (port: InPort, name) => {
    // TODO copy-paste, easy ports name mapping
    name = cleanPortName(name);

    if (port.iipBuffer.length) {
      port.iipBuffer = port.iipBuffer.slice(-1);
      values[name] = port.iipBuffer[0].data;
    } else if (port.buffer.length) {
      port.buffer = port.buffer.slice(-1);
      values[name] = port.buffer[0].data;
    }
  });

  const anyComponent = component as any;
  anyComponent.outPortsFns ??= {};

  mapObj(component.outPorts.ports as Record<string, OutPort>, (port: OutPort, name) => {
    const cleanName = cleanPortName(name);

    // cache function to avoid creating new function on every call
    values[cleanName] = anyComponent.outPortsFns[cleanName] ??= (value: any) => {
      component.outPorts.send(name, value, undefined!);
    };
    // if (port.iipBuffer.length) values[name] = port.iipBuffer[port.iipBuffer.length - 1].data;
    // else if (port.buffer.length) values[name] = port.buffer[port.buffer.length - 1].data;
  });
  return values;
}

export const createReactEngineComponent = (ports: PortsDescription) => {
  const { inPorts, outPorts } = toNofloPorts(ports);

  return (metadata: any) =>
    createComponent({
      metadata,
      start(this: any) {
        if (!metadata.setPorts) return;

        const portsValues = getPortsValues(this);
        metadata.setPorts.default?.(portsValues);
        metadata.setPorts['node-engine']?.(portsValues);
      },
      proc(ins, ctx, out) {
        const nodeInstance = ctx.nodeInstance as any;
        const setPorts = nodeInstance.metadata?.setPorts;
        if (!setPorts) {
          return;
        }
        // check all required ports set
        let allSet = true;
        mapObj(inPorts as Obj<any>, (port: any, name) => {
          if (allSet && port.required && !(name in ins)) {
            allSet = false;
          }
        });
        if (allSet) {
          const portValues = getPortsValues(nodeInstance);
          setPorts.default?.(portValues);
          setPorts['node-engine']?.(portValues);
        }
      },
      inPorts,
      outPorts,
    });
};
