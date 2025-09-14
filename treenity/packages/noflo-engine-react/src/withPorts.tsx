import { shallowEqual } from '@treenity/js-shared/utils';
import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useEngineStore } from './NodeEngineContext';
import { NodeEngineStore, RuntimeComponent } from './node-engine-store';

export type WithPortsMin = {
  id: string;
  url?: string;
  value?: any;
};

export function withPorts<T extends {}, P extends {}>(
  Component: React.FC<T & P & WithPortsMin>,
  url: string,
  // options: ComponentOptions,
): React.FC<T & WithPortsMin> {
  const ComponentWithPorts = (props: T & WithPortsMin) => {
    const addComponent = useEngineStore(state => state.addComponent);
    const removeComponent = useEngineStore(state => state.removeComponent);

    const selector = React.useMemo(
      () => (state: NodeEngineStore) => ({
        portValues: state.portValues[props.id || url] as P,
        setPortValuesById: state.setPortValuesById<P>,
      }),
      [props.id, url],
    );

    const { setPortValuesById, portValues } = useEngineStore(selector);

    // const namespace = useContext(NodeEngineNamespaceContext);

    const setPortValues = useCallback(
      (values: P) => {
        setPortValuesById(props.id || url, values);
      },
      [setPortValuesById, props.id, url],
    );

    useLayoutEffect(() => {
      const { value, id } = props;

      let $id = id,
        $type,
        $name = id,
        $subContext;

      if (value) {
        ({ $id, $type, $name, $subContext } = value);
      } else {
        const [subContextPart, typePart] = url.includes(':') ? url.split(':') : ['default', url];

        $subContext = subContextPart;
        $type = typePart;
      }

      const setPorts = {
        [$subContext || 'default']: setPortValues,
      };

      // TODO: Change later
      const component = {
        $id: id,
        $type: url,
        $name: id,
        setPorts,
      } satisfies RuntimeComponent;

      addComponent(component);

      return () => removeComponent(component.$id);
    }, [setPortValuesById]);

    return Component({ ...props, ...portValues, setPortValues });
  };
  ComponentWithPorts.displayName = `WithPorts<${Component.displayName || Component.name || url}>`;
  ComponentWithPorts.whyDidYouRender = true;

  return ComponentWithPorts;
}
