import { getTzFromContext } from '@/hooks/time-offset-hook';

describe('TZ offset method test', () => {
  it('Get tz if not found headers in context', async () => {
    const tz = getTzFromContext(undefined);
    expect(tz).toEqual(undefined);
  });

  it('Get tz if tz equal string', async () => {
    const tz = getTzFromContext('test');
    expect(tz).toEqual(undefined);
  });

  it('Positive number', async () => {
    const tz = getTzFromContext('123');
    expect(tz).toEqual(123);
  });

  it('Negative number', async () => {
    const tz = getTzFromContext('-360');
    expect(tz).toEqual(-360);
  });

  it('tz value equal A', async () => {
    const tz = getTzFromContext('a');
    expect(tz).toEqual(undefined);
  });

  it('null value', async () => {
    const tz = getTzFromContext(null!);
    expect(tz).toEqual(undefined);
  });
});
