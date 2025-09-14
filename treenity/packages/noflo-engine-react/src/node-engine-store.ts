import { Meta } from '@treenity/core';
import { createStorageStore } from '@treenity/ui-kit/store';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow';

export type { Edge };

export interface RuntimeComponent extends Meta {
  setPorts: Record<string, (values: any) => void>;
}

export interface NodeEngineStore {
  components: RuntimeComponent[];

  nodes: ITreenityNode[];

  portValues: Record<string, any>;

  edges: Edge[];

  onNodesChange: OnNodesChange;

  onEdgesChange: OnEdgesChange;

  onConnect: OnConnect;

  setNodes: (nodes: ITreenityNode[]) => void;

  setEdges: (edges: Edge[]) => void;

  setPortValuesById: <P extends {}>(id: string, values: P) => void;

  addComponent(component: RuntimeComponent): void;

  removeComponent(id: RuntimeComponent['$id']): void;
}

export type ITreenityNodeData = { $type: string; label: string };
export type ITreenityNode = Node<ITreenityNodeData, string>;

type PersistedNodeEngineStore = Omit<NodeEngineStore, 'components' | 'nodes'>;

export const createEngineStore: () => ReturnType<
  typeof createStorageStore<NodeEngineStore, PersistedNodeEngineStore>
> = () =>
  createStorageStore<NodeEngineStore, PersistedNodeEngineStore>(
    {
      name: 'node-engine-store',
      partialize: ({ components, nodes, ...state }) => {
        return state;
      },
    },
    (set, get) => ({
      components: [],

      edges: [],

      nodes: [],

      portValues: {},

      setPortValuesById: (id: string, values: any) => {
        set(state => {
          state.portValues[id] = { ...state.portValues?.[id], ...values };
        });
      },

      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      setNodes: (nodes: ITreenityNode[]) => {
        set({ nodes });
      },

      setEdges: (edges: Edge[]) => {
        set({ edges });
      },

      removeComponent(id) {
        set(state => {
          // console.info(`%cremoving component ${id}`, 'color: red');
          state.components = state.components.filter(c => c.$id !== id);
          state.nodes = state.nodes.filter(c => c.id !== id);
        });
      },

      addComponent(component: RuntimeComponent) {
        set(state => {
          const duplicateIndex = state.components.findIndex(c => c.$id === component.$id);

          // TODO: Clean this up later
          if (component.$id === component.$type) {
            return;
          }

          if (duplicateIndex !== -1) {
            const duplicateComponent = state.components[duplicateIndex];
            const incomingPortKeys = Object.keys(component.setPorts);

            console.info(`%cupdating setPorts for ${component.$id}`, 'color: green');

            state.components[duplicateIndex].setPorts = {
              ...duplicateComponent.setPorts,
              ...component.setPorts,
            };
          } else {
            // console.info(`%cadding component ${component.$id}`, 'color: green');
            state.components.push(component);
            const lastNodePosition = state?.nodes[state?.nodes.length - 1]?.position || {
              x: 0,
              y: 0,
            };
            state.nodes.push({
              id: component.$id,
              type: 'treenityNode',
              data: {
                $type: component.$type,
                label: component.$name,
              },
              position: { x: lastNodePosition.x + 200, y: lastNodePosition.y + 140 },
            });
          }
        });
      },
    }),
  );
