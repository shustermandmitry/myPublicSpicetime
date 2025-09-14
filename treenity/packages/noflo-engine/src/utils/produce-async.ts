import { createDraft, Draft, finishDraft, Objectish } from 'immer';

/**
 * Immer stopped to support async functions as recipe, this utils made to replace it
 * @param base - base object to change
 * @param recipe - changing function
 * @return changed clone of object
 */
export async function produceAsync<T extends Objectish>(
  base: T,
  recipe: (draft: Draft<T>) => Promise<void>,
): Promise<T> {
  const draft = createDraft(base);
  await recipe(draft);
  return finishDraft(draft) as T;
}
