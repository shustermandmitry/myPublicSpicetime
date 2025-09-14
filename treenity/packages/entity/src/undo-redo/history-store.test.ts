/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { action, makeObservable } from 'mobx';
import { HistoryStore } from './history-store';

interface Document {
  box: {
    point: number[];
  };
}

class TestApp extends HistoryStore<Document> {
  constructor() {
    super({ box: { point: [0, 0] } });
    makeObservable(this);
  }

  @action update = (change: Document) => {
    Object.assign(this.document, change);
    return this;
  };

  @action updatePoint = (point: number[]) => {
    this.document.box.point = point;
    return this;
  };

  castToAny = () => {
    return this as any;
  };

  expectPointToBe = (n: number[]) => {
    expect(this.document.box.point).toMatchObject(n);
    return this;
  };

  expectDebugChangeCountToBe = (n: number) => {
    expect(this.debugChangeCount).toBe(n);
    return this;
  };

  expectPointerToBe = (n: number) => {
    expect(this.pointer).toBe(n);
    return this;
  };

  expectPausedToBe = (n: boolean) => {
    expect(this.isPaused).toBe(n);
    return this;
  };
}

describe('When setting up', () => {
  it('Has the correct initial state', async () => {
    const app = new TestApp();
    app.expectPausedToBe(false);
    app.expectPointerToBe(-1);
    app.expectPointToBe([0, 0]);
  });
});

describe('When updating the history', () => {
  it('Commits when the document changes.', async () => {
    const app = new TestApp();
    // expect(app.status).toBe("running")
    app.expectPointerToBe(-1);
    app.updatePoint([1, 1]);
    app.expectPointerToBe(0);
    app.expectPointToBe([1, 1]);
  });

  it('Does change, undo.', async () => {
    const app = new TestApp();
    app.expectPausedToBe(false);
    app.expectPointerToBe(-1);
    app.updatePoint([1, 1]);
    app.expectPointerToBe(0);
    app.expectPointToBe([1, 1]);
    app.expectPausedToBe(false);
    app.undo();
    app.expectPointToBe([0, 0]);
  });

  it('Does change, undo, redo', async () => {
    const app = new TestApp();
    app
      .expectDebugChangeCountToBe(0)
      .expectPausedToBe(false)
      .expectPointerToBe(-1)
      .updatePoint([1, 1])
      .expectDebugChangeCountToBe(1)
      .expectPointerToBe(0)
      .undo()
      .expectDebugChangeCountToBe(2)
      .expectPointerToBe(-1)
      .expectPointToBe([0, 0])
      .redo()
      .expectDebugChangeCountToBe(3)
      .expectPointerToBe(0)
      .expectPointToBe([1, 1]);
  });

  it('Does change, undo, undo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);
    app.undo();
    app.undo();
    app.expectPointToBe([0, 0]);
  });

  it('Does change, change, undo.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);
    app.updatePoint([2, 2]);
    app.undo();
    app.expectPointToBe([1, 1]);
  });

  it('Does change, change, undo, undo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);
    app.updatePoint([2, 2]);
    app.undo();
    app.undo();
    app.expectPointToBe([0, 0]);
  });

  it('Does change, change, undo, change, undo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);
    app.updatePoint([2, 2]);
    app.undo();
    app.expectPointToBe([1, 1]);
    app.updatePoint([3, 3]);
    app.undo();
    app.expectPointToBe([1, 1]);
  });

  it('Does change, change, undo, redo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.undo();

    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Does change, change, undo, undo, redo, redo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.undo();

    app.undo();

    app.redo();

    app.redo();

    app.expectPointToBe([2, 2]);
  });
});

describe('When pausing the history...', () => {
  it('Ignores changes while paused.', async () => {
    const app = new TestApp();
    app.expectPointerToBe(-1);
    app.pause();
    app.expectPointerToBe(-1);
    app.updatePoint([1, 1]);

    app.expectPointerToBe(0);
    app.updatePoint([2, 2]);

    app.expectPointerToBe(0);
    app.resume();
    app.expectPointerToBe(0);
    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPointerToBe(-1);
    app.expectPointToBe([0, 0]);
  });

  it('Resumes.', async () => {
    const app = new TestApp();
    app.pause();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.resume();
    app.updatePoint([3, 3]);

    app.expectPointToBe([3, 3]);
    app.undo();

    app.expectPointToBe([2, 2]);
    app.redo();

    app.expectPointToBe([3, 3]);
  });

  it('Does not update pointer if no change occurred while paused.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.pause();
    app.resume();
    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPointToBe([1, 1]);
    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Updates pointer if a change occurred while paused.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.resume();
    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPointToBe([1, 1]);
    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Resumes correctly after resuming.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.resume();
    app.updatePoint([3, 3]);

    app.expectPointToBe([3, 3]);
    app.undo();

    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPointToBe([1, 1]);
    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Resumes while deep in undos.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.updatePoint([3, 3]);

    app.undo();

    app.pause();
    app.resume();
    app.expectPointToBe([2, 2]);
    app.redo();

    app.expectPointToBe([3, 3]);
  });

  it('Undoes after slicing history stack.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]); // A

    app.updatePoint([2, 2]); // aB

    app.updatePoint([3, 3]); // abC

    app.undo(); // aBc

    app.updatePoint([4, 4]); // abD

    app.undo(); // aBd

    app.expectPointToBe([2, 2]);
  });

  it('Resumes when undo is called while paused', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.expectPausedToBe(true);
    app.undo();

    app.expectPausedToBe(false);
    app.expectPointToBe([1, 1]);
    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Resumes when redo is called while paused', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.undo();

    app.pause();
    app.expectPausedToBe(true);
    app.redo();

    app.expectPausedToBe(false);
    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPointToBe([1, 1]);
  });
});

describe('When emitting history events...', () => {
  it('emits a change event', async () => {
    const onUndo = jest.fn();
    const app = new TestApp();
    app.on('undo', onUndo);
    app.updatePoint([1, 1]);

    expect(onUndo).toHaveBeenCalledTimes(0);
    app.undo();

    expect(onUndo).toHaveBeenCalledTimes(1);
  });
});

describe('When undoing...', () => {
  it('it undoes', async () => {
    const app = new TestApp();
    app.expectPointToBe([0, 0]);

    app.updatePoint([1, 1]);

    app.expectPointToBe([1, 1]);
    app.undo();

    app.expectPointToBe([0, 0]);
  });

  it('emits an undo event on undo', async () => {
    const onUndo = jest.fn();
    const app = new TestApp();
    app.on('undo', onUndo);
    app.updatePoint([1, 1]);

    expect(onUndo).toHaveBeenCalledTimes(0);
    app.undo();

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('does not emits an undo event if it cannot undo', async () => {
    const onUndo = jest.fn();
    const app = new TestApp();
    app.on('undo', onUndo);
    app.updatePoint([1, 1]);

    expect(onUndo).toHaveBeenCalledTimes(0);
    app.undo();

    expect(onUndo).toHaveBeenCalledTimes(1);
    app.undo();

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('Changes the frame on undo', async () => {
    const onUndo = jest.fn();
    const app = new TestApp();
    app.on('undo', onUndo);
    app.expectPointerToBe(-1);
    expect(app.stack.length).toBe(0);
    app.expectPointToBe([0, 0]);
    // Increments history frame and pushes to history stack
    app.updatePoint([1, 1]);

    app.expectPointerToBe(0);
    expect(app.stack.length).toBe(1);
    app.expectPointToBe([1, 1]);
    // Decrements history frame
    app.undo();

    app.expectPointerToBe(-1);
    expect(app.stack.length).toBe(1);
    app.expectPointToBe([0, 0]);
    // Can't undo further, noop
    app.undo();

    app.expectPointerToBe(-1);
    expect(app.stack.length).toBe(1);
    app.expectPointToBe([0, 0]);
  });

  it('resumes if undo is called while paused', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.expectPausedToBe(true);
    app.expectPointToBe([2, 2]);
    app.undo();

    app.expectPausedToBe(false);
  });

  it('performs an undo after resuming when undo is called while paused', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.undo();

    app.expectPointToBe([1, 1]);
  });

  it('after resuming from an undo, redo restores state when we undo-resumed', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 2]);

    app.undo();

    app.redo();

    app.expectPointToBe([2, 2]);
  });

  it('Resumes from an undo even if we cannot go back any further.', async () => {
    const app = new TestApp();
    app.pause();
    app.expectPausedToBe(true);
    app.undo();

    app.expectPausedToBe(false);
    app.expectPointToBe([0, 0]);
  });

  it('Survives multiple resumes', async () => {
    const app = new TestApp();
    app.pause();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.updatePoint([3, 3]);

    app.resume();
    app.pause();
    app.updatePoint([4, 4]);

    app.updatePoint([5, 5]);

    app.updatePoint([6, 6]);

    app.resume();
    app.expectPointToBe([6, 6]);
    app.undo();

    app.expectPointToBe([3, 3]);
    app.undo();

    app.expectPointToBe([0, 0]);
  });
});

describe('When redoing...', () => {
  it('emits a redo event', async () => {
    const onRedo = jest.fn();
    const app = new TestApp();
    app.on('redo', onRedo);
    app.updatePoint([1, 1]);

    expect(onRedo).toHaveBeenCalledTimes(0);
    app.undo();

    expect(onRedo).toHaveBeenCalledTimes(0);
    app.redo();

    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it('does not emit a redo event when it cannot redo', async () => {
    const onRedo = jest.fn();
    const app = new TestApp();
    app.on('redo', onRedo);
    app.updatePoint([1, 1]);

    expect(onRedo).toHaveBeenCalledTimes(0);
    app.undo();

    expect(onRedo).toHaveBeenCalledTimes(0);
    app.redo();

    expect(onRedo).toHaveBeenCalledTimes(1);
    app.redo();

    expect(onRedo).toHaveBeenCalledTimes(1);
  });

  it('Changes the frame on redo', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.updatePoint([3, 3]);

    app.undo();

    // Starting from one frame back...
    app.expectPointerToBe(1);
    expect(app.stack.length).toBe(3);
    app.expectPointToBe([2, 2]);
    // Increments history frame on redo
    app.redo();

    app.expectPointerToBe(2);
    expect(app.stack.length).toBe(3);
    app.expectPointToBe([3, 3]);
    // Can't redo further, noop
    app.redo();

    app.expectPointerToBe(2);
    expect(app.stack.length).toBe(3);
    app.expectPointToBe([3, 3]);
  });

  it('resumes if redo is called while paused while redos are still pending', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.undo();

    app.pause();
    app.expectPausedToBe(true);
    app.redo();

    app.expectPausedToBe(false);
  });

  it('performs a redo after resuming when redo is called while paused', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.undo();

    app.pause();
    app.expectPointToBe([0, 0]);
    app.redo();

    app.expectPointToBe([1, 1]);
  });

  it('Resumes from an redo even if we cannot go forward.', async () => {
    const app = new TestApp();
    app.updatePoint([1, 1]);

    app.undo();

    app.pause();
    app.updatePoint([2, 2]);

    app.redo();

    app.expectPausedToBe(false);
  });
});

describe('When doing...', () => {
  it('emits a commit event', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    expect(onCommit).toHaveBeenCalledTimes(0);
    app.updatePoint([1, 1]);

    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('clears any pending redos', async () => {
    const onRedo = jest.fn();
    const app = new TestApp();
    app.on('redo', onRedo);
    app.updatePoint([1, 1]);

    app.updatePoint([2, 2]);

    app.undo();

    app.updatePoint([3, 3]);

    app.redo();

    expect(onRedo).toHaveBeenCalledTimes(0);
    app.expectPointToBe([3, 3]);
  });

  it('Does not commit while paused.', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 1]);

    app.updatePoint([3, 1]);

    expect(onCommit).toHaveBeenCalledTimes(1);
    app.expectPointToBe([3, 1]);
  });

  it('Does not commit on resume when a change did not occur while paused.', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    app.updatePoint([1, 1]);

    app.pause();
    app.resume();
    expect(onCommit).toHaveBeenCalledTimes(1);
    app.expectPointToBe([1, 1]);
  });

  it('Commit on resume if a change occurred while paused.', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    app.updatePoint([1, 1]);

    app.pause();
    app.updatePoint([2, 1]);

    app.updatePoint([3, 1]);

    app.resume();
    expect(onCommit).toHaveBeenCalledTimes(2);
    app.expectPointToBe([3, 1]);
  });
});

describe('When committing...', () => {
  it('emits a commit event on changes', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    // Commit on changes.
    app.updatePoint([1, 1]);

    expect(onCommit).toHaveBeenCalledTimes(1);
    app.updatePoint([2, 2]);

    expect(onCommit).toHaveBeenCalledTimes(2);
  });

  it('emits a commit event on do', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    // Commit on do.
    app.updatePoint([1, 1]);

    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('emits a commit event on undo', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    app.updatePoint([1, 1]);

    // Commit on undo.
    app.undo();

    expect(onCommit).toHaveBeenCalledTimes(2);
  });

  it('emits a commit event on redo', async () => {
    const onCommit = jest.fn();
    const app = new TestApp();
    app.on('commit', onCommit);
    app.updatePoint([1, 1]);

    app.undo();

    // Commit on redo.
    app.redo();

    expect(onCommit).toHaveBeenCalledTimes(3);
  });
});
