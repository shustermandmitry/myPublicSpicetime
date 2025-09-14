import {
  IReactContextProps,
  Meta,
  MetaName,
  PortsDescription,
  ReactContextOptions,
  ReactTypeContextInfo,
  types,
} from '@treenity/core';

import * as React from 'react';
import { createReactEngineComponent } from './create-react-engine-component';
import { withPorts, WithPortsMin } from './withPorts';

export function addReactNoflo<P>(
  name: MetaName<P>,
  comp: React.FC<IReactContextProps<Meta, P & WithPortsMin>>,
  options?: ReactContextOptions & { ports: PortsDescription },
): ReactTypeContextInfo {
  if (options?.ports) {
    types.noflo.add(name, createReactEngineComponent(options.ports), { ports: options.ports });
    // @ts-ignore
    return types.react.add(name, withPorts(comp, name), options);
  } else {
    // @ts-ignore
    return types.react.add(name, comp, options);
  }
}
