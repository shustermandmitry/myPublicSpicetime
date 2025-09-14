import { ComponentLoadHook, useGetComponent } from './hooks/useLoadComponent';

interface RenderProps {
  id: string;
  name?: string;
  context?: string;
  children?: any;
  useLoadHook?: ComponentLoadHook,
}

function Render({ id, name = 'default', context = 'react', children, useLoadHook = useGetComponent, ...more }: RenderProps) {
  console.log('rendering', id, name, context);
  const [componentInfo, isLoading] = useLoadHook(id, name, context);
  if (isLoading) return <div className="spinner" />;

  try {
    const { component: Component, props } = componentInfo;

    return (
        <Component {...more} {...props} id={id} context={context} name={name} children={children} />
    );
  } catch (e) {
    console.error('Render', id, context, name, e);
    return null;
  }
}

export default Render;
