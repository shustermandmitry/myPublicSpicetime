import type { Data } from '@measured/puck';

function transformProps(props: any): any {
  const result: any = { id: props.id };

  for (const [key, value] of Object.entries(props)) {
    if (Array.isArray(value)) {
      result[key] = value.map(() => ({}));
    }
  }

  return result;
}

export function transformPuckData(data: Data): Data {
  return {
    ...data,
    content: data.content.map(item => ({
      type: item.type,
      props: transformProps(item.props),
    })),
    root: {
      props: transformProps(data.root.props),
    },
    zones: Object.fromEntries(
      Object.entries(data.zones || {}).map(([key, value]) => [
        key,
        value.map(item => ({
          type: item.type,
          props: transformProps(item.props),
        })),
      ]),
    ),
  };
}
