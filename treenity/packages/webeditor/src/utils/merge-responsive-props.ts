import type { ScreenSize } from '@/constants/breakpoints';
import { screenSizesMap } from '@/constants/breakpoints';

import { merge } from '@s-libs/micro-dash';

/**
 * Transforms a flat object with nested keys into a nested object
 * @param obj
 * @param options
 */
export function transformPathProps<T extends Record<string, any>>(
  obj: T,
  options?: { exclude?: string[] },
) {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(/\.|\[|\]/).filter(Boolean);

    // Check if the first part is in the exclude list
    if (options?.exclude?.includes(parts[0])) {
      continue;
    }

    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        current[part] = value;
      } else {
        if (!(part in current)) {
          const nextPart = parts[i + 1];
          current[part] = isNaN(Number(nextPart)) ? {} : [];
        }
        current = current[part];
      }
    }
  }

  return result;
}

/**
 * Merges default props with responsive overrides
 * @param defaultProps
 * @param responsiveOverride
 * @param breakpoint
 */

export function mergeNestedProps<T extends Record<string, any>>(
  defaultProps: T,
  responsiveOverride: Partial<Record<ScreenSize, T>>,
  breakpoint: ScreenSize,
) {
  const mergedOverrides = mergeResponsiveProps(responsiveOverride, breakpoint);

  return merge(JSON.parse(JSON.stringify(defaultProps)), transformPathProps(mergedOverrides));
}

/**
 * Merges responsive props based on the current screen size
 * @param obj
 * @param screenSize
 */
export function mergeResponsiveProps(obj: { [K in ScreenSize]?: any }, screenSize: ScreenSize) {
  const result = {};
  const screenSizes = Object.keys(screenSizesMap) as ScreenSize[];

  const currentSizeIndex = screenSizes.indexOf(screenSize);

  const createPriorityOrder = (n: number) => {
    const base = Array.from({ length: screenSizes.length }, (_, i) => i);

    const lowerScreens = base.slice(0, n);
    const higherScreen = base.slice(n + 1).reverse();
    return [...higherScreen, ...lowerScreens, n];
  };

  const priorityOrder = createPriorityOrder(currentSizeIndex);
  priorityOrder.forEach(index => {
    const size = screenSizes[index];
    if (obj[size]) {
      merge(result, obj[size]);
    }
  });

  return result;
}
