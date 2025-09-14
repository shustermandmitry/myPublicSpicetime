import { Render, ShowAfterTimeout } from '@treenity/ui-kit';
import { useEffect, useState } from 'react';
import { Edge } from 'reactflow';
import { addReactNoflo } from '../add-react-noflo';
import { NodeEngineContextProvider, useEngineStore } from '../NodeEngineContext';
import { NofloEngineRunner } from '../NofloEngineRunner';
import './react-store';

addReactNoflo(
  'react/sum',
  ({ a, b, out }: { a: number; b: number; out: (val: number) => void }) => {
    useEffect(() => {
      if (a === undefined || b === undefined || out === undefined) return;

      out(a + b);
    }, [a, b, out]);

    return <>Sum: {a + b}</>;
  },
  {
    ports: {
      in: {
        a: { type: 'number', required: true },
        b: { type: 'number', required: true },
      },
      out: {
        out: { type: 'number' },
      },
    },
  },
);

addReactNoflo(
  'react/number',
  ({ id, input, out }: { id: string; input: number; out: (val: number) => void }) => {
    const [number, setNumber] = useState(input || 0);

    const onChange = (evt: any) => {
      const value = +evt.target.value;
      console.log('setting number', value);
      setNumber(value);
    };

    useEffect(() => {
      if (out === undefined) return;

      console.log('number', id, number);
      out(number);
    }, [number, out]);

    return (
      <>
        Number:{' '}
        <input type="number" value={number} onChange={onChange}>
          {input}
        </input>
      </>
    );
  },
  {
    ports: {
      in: { input: { type: 'number' } },
      out: {
        out: { type: 'number' },
      },
    },
  },
);

addReactNoflo(
  'react/logger',
  ({ input }: { input: any }) => {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
      setLogs([...logs, input]);
    }, [input]);

    return (
      <div>
        Logger:{' '}
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div>
    );
  },
  {
    ports: {
      in: { input: { type: 'all' } },
      out: {},
    },
  },
);

function Engine() {
  const store = useEngineStore();

  function loadGraph() {
    if (store.edges.length > 0) return;
    store.onEdgesChange(
      (
        [
          {
            id: 'numA-sum1',
            source: 'numA',
            target: 'sum1',
            sourceHandle: 'out',
            targetHandle: 'a',
          },
          {
            id: 'numB-sum1',
            source: 'numB',
            target: 'sum1',
            sourceHandle: 'out',
            targetHandle: 'b',
          },
          {
            id: 'sum1-log1',
            source: 'sum1',
            target: 'log1',
            sourceHandle: 'out',
            targetHandle: 'input',
          },
        ] as Edge[]
      ).map(item => ({ type: 'add', item })),
    );
  }

  useEffect(() => {
    loadGraph();
  }, []);

  return (
    <>
      {/*<div>*/}
      {/*  <button onClick={loadGraph}>Load graph</button>*/}
      {/*</div>*/}
      <NofloEngineRunner />

      <div>
        <Render id="numA" url="react/number" />
      </div>
      <div>
        <ShowAfterTimeout timeout={2000}>
          <Render id="numB" url="react/number" />
        </ShowAfterTimeout>
      </div>
      <div>
        <Render id="sum1" url="react/sum" />
      </div>
      <div>
        <ShowAfterTimeout timeout={1000}>
          <Render id="log1" url="react/logger" />
        </ShowAfterTimeout>
      </div>

      <h1>Engine</h1>
    </>
  );
}

export default () => (
  <NodeEngineContextProvider>
    <Engine />
  </NodeEngineContextProvider>
);
