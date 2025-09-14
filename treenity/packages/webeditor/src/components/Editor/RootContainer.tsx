import { EditorFC } from '@/components/Editor/editor';
import { useNode } from '@craftjs/core';
import { withNode } from '../blocks/shared/withNode';

const RootContainer: EditorFC<{ style?: React.CSSProperties }> = ({ children, style }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const mergedStyle = {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '600px',
    ...(style ?? {}),
  } as React.CSSProperties;

  return (
    <div className="container" style={mergedStyle} ref={dom => dom && connect(drag(dom))}>
      {children}
    </div>
  );
};

RootContainer.craft = {
  displayName: 'Container',
};

const NodeRootContainer = withNode(RootContainer, { draggable: true, droppable: true }, 'Root');

export { NodeRootContainer, RootContainer };
