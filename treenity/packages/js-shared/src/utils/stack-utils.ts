/*
 * Copyright (c) 2024. Treenity Inc.
 */

/**
 * Get source file name from error stack, useful to find out where the function was called
 * @param depth - how many levels to go up in the stack
 * @param changeExt - change extension of the file, just for convenience
 */
export function getFileFromStack(depth: number, changeExt?: string) {
  const stack = new Error().stack!.split('\n');
  const classFile = stack[depth];
  if (classFile) {
    const match = classFile.match(/.*?\((.*?):\d+:\d+\)/);
    if (match) {
      return changeExt ? match[1].slice(0, match[1].lastIndexOf('.')) + '.' + changeExt : match[1];
    }
  }
}
