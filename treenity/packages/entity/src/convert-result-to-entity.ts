/*
 * Copyright (c) 2024. Treenity Inc.
 */

export async function convertResultToEntity(
  createEntity: (raw: any) => any,
  result: any,
): Promise<any> {
  if (!result) return result;

  let resultData = result;
  if (Array.isArray(result)) {
    if (result.length > 0) {
      resultData = await Promise.all(result.map(createEntity));
    }
  } else if (result.$type) {
    resultData = await createEntity(result);
  } else if (Array.isArray((result as any).data)) {
    result.data = await Promise.all(result.data.map(createEntity));
  }
  return resultData;
}
