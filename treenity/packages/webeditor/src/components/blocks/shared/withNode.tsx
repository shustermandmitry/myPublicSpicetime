import { useEditor, useNode } from '@craftjs/core';
import styled from '@emotion/styled';

import { forwardRef, PropsWithChildren } from 'react';

const EMPTY_CONTAINER_MIN_HEIGHT = 120;

export const EmptyContainer = styled.div`
  padding: 24px;
  font-style: italic;
  text-align: center;
  background-color: color-mix(in srgb, ${p => p.theme.colorPrimary} 3%, transparent);
  border-radius: 0.5rem;
  border: 2px dashed ${p => p.theme.colorPrimary};
  color: rgb(120 113 108);
  transition: all 0.2s ease-in-out;
  max-height: inherit;
  height: ${EMPTY_CONTAINER_MIN_HEIGHT}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colorPrimary};
  font-weight: 600;

  &:hover {
    background-color: color-mix(in srgb, ${p => p.theme.colorPrimary} 15%, transparent);
  }
`;

export const withNode = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  { draggable = true, droppable = true } = {},
  displayName?: string,
) => {
  const WithNode = forwardRef<HTMLElement, PropsWithChildren<T>>((props, ref) => {
    const {
      id,
      connectors: { connect, drag },
    } = useNode();

    const { isActive, isDraggedOver, isAllChildrenDragged, isCanvas } = useEditor(
      (state, query) => {
        const descendants = query.node(id).descendants();
        const isCanvas = (query.node(id).isCanvas() && id !== 'ROOT') || false;

        return {
          isActive: query.getEvent('selected').contains(id),
          isCanvas,
          isDraggedOver: state.indicator?.placement.parent.id === id,
          isAllChildrenDragged:
            isCanvas &&
            descendants?.length > 0 &&
            descendants?.every(child => {
              return query.getEvent('dragged').contains(child);
            }),
        };
      },
    );

    const applyRef = (node: HTMLElement | null) => {
      if (node) {
        if (draggable && droppable) {
          connect(drag(node));
        } else if (droppable) {
          connect(node);
        } else if (draggable) {
          drag(node);
        }
        // Forward the ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }
    };
    const { children, ...restProps } = props;

    return (
      <div
        ref={applyRef}
        style={
          isCanvas
            ? {
                minHeight:
                  isAllChildrenDragged || !children ? EMPTY_CONTAINER_MIN_HEIGHT + 'px' : 'auto',
                border: isAllChildrenDragged || isDraggedOver ? '1px solid #2563eb' : 'none',
                backgroundColor: isAllChildrenDragged || isDraggedOver ? '#e6f3ff' : 'transparent',
              }
            : {}
        }
      >
        {/*  @ts-ignore */}
        <Component
          // @ts-ignore
          className={isActive ? `${restProps?.className} component-selected` : restProps?.className}
          {...restProps}
        >
          {typeof children === 'string' && children.trim() === '' ? (
            <>Empty text</>
          ) : (
            children ||
            (props.url ? (
              <EmptyContainer>Empty Container</EmptyContainer>
            ) : (
              <EmptyContainerWorkspace />
            ))
          )}
        </Component>
      </div>
    );
  });

  WithNode.displayName = `WithNode(${displayName ?? Component?.displayName})`;
  // @ts-ignore
  WithNode.name = displayName ?? Component?.displayName;

  // @ts-ignore
  WithNode.craft = {
    displayName: displayName ?? Component?.displayName,
  };

  return WithNode;
};
const EmptyContainerWorkspace = styled(EmptyContainer)`
  height: 100%;
`;
