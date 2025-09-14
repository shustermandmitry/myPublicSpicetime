import { getNestedComponentIds } from '../get-nested-component-ids';
type ComponentData = {
  type: string;
  props: Record<string, unknown>;
};

const mockData: {
  content: ComponentData[];
  root: Record<string, unknown>;
  zones: Record<string, ComponentData[]>;
} = {
  content: [
    {
      type: 'flex',
      props: {
        id: 'flex-1',
      },
    },
  ],
  root: {},
  zones: {
    'flex-1:item-0': [
      {
        type: 'button',
        props: {
          id: 'button-1',
        },
      },
    ],
    'flex-1:item-1': [
      {
        type: 'button',
        props: {
          id: 'button-2',
        },
      },
      {
        type: 'flex',
        props: {
          id: 'flex-2',
        },
      },
    ],
    'flex-2:item-0': [
      {
        type: 'button',
        props: {
          id: 'button-3',
        },
      },
    ],
    'flex-2:item-1': [
      {
        type: 'button',
        props: {
          id: 'button-4',
        },
      },
    ],
  },
};

describe('getNestedComponentIds', () => {
  it('should collect all nested component ids', () => {
    const ids = getNestedComponentIds('flex-1', mockData);
    expect(ids).toEqual(['flex-1', 'button-1', 'button-2', 'flex-2', 'button-3', 'button-4']);
  });

  it('should collect component id for a leaf component', () => {
    const ids = getNestedComponentIds('button-1', mockData);
    expect(ids).toEqual(['button-1']);
  });

  it('should collect all nested component ids for a nested component', () => {
    const ids = getNestedComponentIds('flex-2', mockData);
    expect(ids).toEqual(['flex-2', 'button-3', 'button-4']);
  });
});
