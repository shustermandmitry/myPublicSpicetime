type RGB = {
  r: number;
  g: number;
  b: number;
};

type HSV = {
  h: number;
  s: number;
  v: number;
};

/**
 * Generates `hover` and `active` colors based on a base color using Ant Design's color system principles.
 *
 * @param baseColor - The base color in hexadecimal format (e.g., '#FF0000' or '#F00')
 * @returns An object containing hover and active colors in hexadecimal format
 * @throws {Error} When the input color is not a valid hexadecimal color
 *
 * @example
 * ```typescript
 * // Generate hover and active colors for a green button
 * const colors = generateNeighbourColors('#27AE60');
 * // Returns: { hover: '#47BA73', active: '#178749' }
 */
export function generateNeighbourColors(baseColor: string): {
  hover: string;
  active: string;
} {
  return {
    hover: adjustColor(baseColor, 'hover'),
    active: adjustColor(baseColor, 'active'),
  };
}

// Helper function to convert HEX to RGB
function hexToRgb(hex: string): RGB {
  const parsedHex = hex.replace(/^#/, '');

  if (parsedHex.length === 3) {
    return {
      r: parseInt(parsedHex[0] + parsedHex[0], 16),
      g: parseInt(parsedHex[1] + parsedHex[1], 16),
      b: parseInt(parsedHex[2] + parsedHex[2], 16),
    };
  } else if (parsedHex.length === 6) {
    return {
      r: parseInt(parsedHex.substring(0, 2), 16),
      g: parseInt(parsedHex.substring(2, 4), 16),
      b: parseInt(parsedHex.substring(4, 6), 16),
    };
  }

  throw new Error('Invalid HEX color.');
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else if (max === b) {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): RGB {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Helper function to convert RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Ant Design style color adjustment
function adjustColor(hex: string, type: 'hover' | 'active'): string {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  if (type === 'hover') {
    // For hover: Decrease saturation and increase value
    const newHsv = {
      h: hsv.h,
      s: Math.max(0, hsv.s - 15),
      v: Math.min(100, hsv.v + 10),
    };
    const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  } else {
    // For active: Increase saturation and decrease value
    const newHsv = {
      h: hsv.h,
      s: Math.min(100, hsv.s + 10),
      v: Math.max(0, hsv.v - 15),
    };
    const newRgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
}
