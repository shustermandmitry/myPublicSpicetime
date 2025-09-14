import { Operation } from 'fast-json-patch';
import PatchManager from '../patch-manager';

describe('PatchManager', () => {
  let executeFn: jest.Mock;
  let patchManager: PatchManager;

  beforeEach(() => {
    jest.useFakeTimers();
    executeFn = jest.fn().mockResolvedValue(undefined);
    patchManager = PatchManager.getInstance('test-entity', executeFn);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    // @ts-expect-error accessing private static field for testing
    PatchManager.instances.clear();
  });

  it('should batch multiple patches within timeout window', () => {
    const patches1: Operation[] = [{ op: 'replace', path: '/name', value: 'test1' }];
    const patches2: Operation[] = [{ op: 'replace', path: '/age', value: 25 }];

    patchManager.addPatches(patches1);
    patchManager.addPatches(patches2);

    jest.runAllTimers();

    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn).toHaveBeenCalledWith([
      { op: 'replace', path: '/name', value: 'test1' },
      { op: 'replace', path: '/age', value: 25 },
    ]);
  });

  it('should consolidate patches with same path', () => {
    const patches1: Operation[] = [{ op: 'replace', path: '/name', value: 'test1' }];
    const patches2: Operation[] = [{ op: 'replace', path: '/name', value: 'test2' }];

    patchManager.addPatches(patches1);
    patchManager.addPatches(patches2);

    jest.runAllTimers();

    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn).toHaveBeenCalledWith([{ op: 'replace', path: '/name', value: 'test2' }]);
  });

  it('should batch patches when added before timeout', () => {
    const patches1: Operation[] = [{ op: 'replace', path: '/name', value: 'test1' }];
    patchManager.addPatches(patches1);

    jest.advanceTimersByTime(500);

    const patches2: Operation[] = [{ op: 'replace', path: '/age', value: 25 }];
    patchManager.addPatches(patches2);

    jest.runAllTimers();

    expect(executeFn).toHaveBeenCalledTimes(1);
    expect(executeFn).toHaveBeenCalledWith([
      { op: 'replace', path: '/name', value: 'test1' },
      { op: 'replace', path: '/age', value: 25 },
    ]);
  });

  it('should maintain separate instances for different entity ids', () => {
    const patchManager2 = PatchManager.getInstance('test-entity-2', executeFn);
    expect(patchManager).not.toBe(patchManager2);
  });

  it('should reuse instance for same entity id', () => {
    const patchManager2 = PatchManager.getInstance('test-entity', executeFn);
    expect(patchManager).toBe(patchManager2);
  });
});
