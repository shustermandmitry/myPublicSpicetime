import { CreateHandlerOptions, DefaultEventHandlers, NodeId, Node, NodeTree } from '@craftjs/core';

import { Node as TreenityNode } from '@treenity/core';

export default class EditorEventHandler extends DefaultEventHandlers {
  private node: TreenityNode;
  private lastDragTarget!: NodeId | null;
  private customDragEndListeners: WeakMap<HTMLElement, boolean> = new WeakMap();
  private currentDraggingElement: HTMLElement | null = null;

  constructor(options: any, node: TreenityNode) {
    super(options);
    this.node = node;
  }
  handlers() {
    const defaultEventHandlers = super.handlers();
    const {
      store: { query, actions },
    } = this.options;

    return {
      ...defaultEventHandlers,

      create: (
        el: HTMLElement,
        userElement: React.ReactElement | (() => NodeTree | React.ReactElement),
        options?: Partial<CreateHandlerOptions>,
      ) => {
        const unbindDefaultCreateHandlers = defaultEventHandlers.create(el, userElement, options);

        const unbindDragStart = this.addCraftEventListener(el, 'dragstart', e => {
          this.lastDragTarget =
            (this.dragTarget.type === 'new' && this.dragTarget.tree.rootNodeId) || null;
        });

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', e => {
          e.craft.stopPropagation();
          e.preventDefault();

          const iframe = document.getElementById('canvas-iframe') as HTMLIFrameElement;

          // If the drag end is outside the iframe, remove the element
          if (iframe) {
            if (iframe.contentDocument !== e.view?.document) {
              if (this.lastDragTarget) {
                actions.delete(this.lastDragTarget);
                this.node
                  ?.remove('$' + this.lastDragTarget)
                  .catch(e => {
                    console.error('error removing node', e);
                  })
                  .finally(() => {
                    this.lastDragTarget = null;
                  });
              }
            }
          }

          // After inserting a new element, select it
          if (this.lastDragTarget) {
            actions.setNodeEvent('selected', this.lastDragTarget);
          }
        });

        return () => {
          unbindDefaultCreateHandlers();
          unbindDragStart();
          unbindDragEnd();
        };
      },
      drop: (el: HTMLElement, targetId: NodeId, options?: Partial<CreateHandlerOptions>) => {
        // @ts-ignore
        if (!query.node(targetId)?.isDroppable()) return () => {};

        const unbindDragover = this.addCraftEventListener(el, 'dragover', e => {
          e.craft.stopPropagation();
          e.preventDefault();

          if (!this.positioner || !query.node(targetId)?.get()) return;

          const indicator = this.positioner.computeIndicator(targetId, e.clientX, e.clientY);

          if (!indicator) return;
          actions.setIndicator(indicator);

          let dropTargetId = indicator.placement.parent.id;

          // @ts-ignore
          if (!query.node(dropTargetId).isDroppable()) return;
          let dropTarget: Node | null = query.node(dropTargetId).get();

          let index = indicator.placement.index + (indicator.placement.where === 'after' ? 1 : 0);

          // Create an element if it's dragged from the elements panel
          if (this.dragTarget.type === 'new') {
            const nodeTree = this.dragTarget.tree;
            const newElementId = nodeTree.rootNodeId;

            actions.addNodeTree(nodeTree, dropTargetId, index);
            actions.setNodeEvent('dragged', newElementId);

            // onCreate triggering creating new meta in node
            if (options && typeof options.onCreate === 'function') options.onCreate(nodeTree);

            this.dragTarget = {
              type: 'existing',
              nodes: [newElementId],
            };
          } else {
            const node = query.node(this.dragTarget.nodes[0]).get();

            // when element's parentId is changing, new dragevent is being created, it causes the original dragend event to be cleaned up.
            // so in here we need to track the dragend for the element that has been dragged over the droppable target and do a cleanup of craft's state.
            // we are not using node.dom because this is not the only draggable element that can be dragged to move this element,
            // it can be dragged by breadcrumb handle as well.
            if (
              this.currentDraggingElement &&
              !this.customDragEndListeners.has(this.currentDraggingElement)
            ) {
              const cleanup = () => {
                actions.setNodeEvent('dragged', []);
                if (this.draggedElementShadow) {
                  this.draggedElementShadow.parentNode?.removeChild(this.draggedElementShadow);
                  //@ts-ignore
                  this.draggedElementShadow = null;
                }
                // @ts-ignore
                actions.setIndicator(null);
                actions.setNodeEvent('dragged', []);
                this.positioner?.cleanup();
                this.positioner = null;
                // @ts-ignore
                this.customDragEndListeners.delete(this.currentDraggingElement);
              };

              this.customDragEndListeners.set(this.currentDraggingElement, true);

              this.currentDraggingElement.addEventListener('dragend', cleanup, {
                once: true,
              });
            }

            // prevent dropping an element into itself
            while (dropTarget && dropTarget.id !== 'ROOT') {
              if (dropTarget.id === node.id) return;
              dropTarget = dropTarget.data.parent ? query.node(dropTarget.data.parent).get() : null;
            }

            actions.move(node, dropTargetId, index);
          }
        });

        const unbindDragenter = this.addCraftEventListener(el, 'dragenter', e => {
          e.craft.stopPropagation();
          e.preventDefault();
        });

        return () => {
          unbindDragenter();
          unbindDragover();
        };
      },
      drag: (el: HTMLElement, id: NodeId) => {
        if (!query.node(id)?.isDraggable()) return () => {};

        const unbindDefaultDragHandlers = defaultEventHandlers.drag(el, id);
        const unbindDragStart = this.addCraftEventListener(el, 'dragstart', e => {
          this.currentDraggingElement = el;
        });

        return () => {
          el.setAttribute('draggable', 'false');
          unbindDefaultDragHandlers();
          unbindDragStart();
        };
      },
    };
  }
}
