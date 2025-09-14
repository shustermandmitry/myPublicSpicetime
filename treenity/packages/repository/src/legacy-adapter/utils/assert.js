class AssertionError extends Error {}

export default function assert(expr, message) {
  if (!Boolean(expr)) {
    throw new AssertionError(message || 'unknown assertion error');
  }
}

export function notNull(val) {
  assert(val != null, 'value is null');
  return val;
}
