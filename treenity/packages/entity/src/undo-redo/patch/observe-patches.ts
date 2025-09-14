import { configure } from 'mobx';
import { deepObserve } from 'mobx-utils';
import { getUndoRedoPatch, Patch } from './undo-redo-patch';

export type IListenerWithPatches = (undo: Patch, redo: Patch) => void;

let deepObserveWithUndoRedoPatches_listeners: Set<any> | undefined = undefined;

export function deepObserveWithUndoRedoPatches<T>(target: T, listener: IListenerWithPatches) {
  let undoStack: Patch[] = [];
  let redoStack: Patch[] = [];

  const notify = () => {
    if (undoStack.length || redoStack.length) {
      let undoFlat = undoStack.reverse().flat();
      let redoFlat = redoStack.flat();
      undoStack = [];
      redoStack = [];
      listener(undoFlat, redoFlat);
    }
  };

  if (!deepObserveWithUndoRedoPatches_listeners) {
    deepObserveWithUndoRedoPatches_listeners = new Set();
    configure({
      reactionScheduler: (f): void => {
        f();
        deepObserveWithUndoRedoPatches_listeners!.forEach(listener => listener());
      },
    });
  }
  deepObserveWithUndoRedoPatches_listeners!.add(notify);

  const disposeDeepObserve = deepObserve(target, (change: any, parent: string) => {
    const { undo, redo } = getUndoRedoPatch(change, parent);
    undoStack.push(undo);
    redoStack.push(redo);
  });

  return () => {
    deepObserveWithUndoRedoPatches_listeners!.delete(notify);
    disposeDeepObserve();
    notify();
  };
}
