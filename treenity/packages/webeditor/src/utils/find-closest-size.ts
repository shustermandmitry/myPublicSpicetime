/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { ScreenSize } from '../constants/index';
import { sizeBreakpointsInPixels } from '../constants/index';

export default function findClosestSize(newWidth: number): ScreenSize {
  let closestSize: ScreenSize = 'sm';
  let smallestDifference = Infinity;

  for (const [size, width] of Object.entries(sizeBreakpointsInPixels)) {
    const difference = Math.abs(newWidth - width);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestSize = size as ScreenSize;
    }
  }

  return closestSize;
}
