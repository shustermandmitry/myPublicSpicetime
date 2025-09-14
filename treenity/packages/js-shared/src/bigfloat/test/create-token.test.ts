// create-decimal.test.ts
import { createToken, DecimalBN, parseToken } from '../create-token';

describe('DecimalBN tests', () => {
  test('DecimalBN is properly initialized', () => {
    const decimalBN = new DecimalBN(10);

    // Test if the DecimalBN instance is properly initialized with a number
    expect(decimalBN.toNumber()).toEqual(10);
    expect(decimalBN.toFixed()).toEqual('10.00');
  });

  test('DecimalBN toFixed method works correctly', () => {
    const decimalBN = new DecimalBN(0.1);

    // Test if the toFixed method formats the number correctly
    expect(decimalBN.toFixed()).toEqual('0.10');
  });

  test('DecimalBN format method works correctly', () => {
    DecimalBN.symbol = 'BN';
    const decimalBN = new DecimalBN(10);

    // Test if the format method prints the symbol correctly
    expect(decimalBN.format(2)).toEqual('10 BN');
    expect(decimalBN.format(0)).toEqual('10 BN');
  });

  test('DecimalBN format method works correctly', () => {
    DecimalBN.symbol = 'BN';
    const decimalBN = new DecimalBN(10.01);

    // Test if the format method prints the symbol correctly
    expect(decimalBN.format(0)).toEqual('10 BN');
    expect(decimalBN.format(1)).toEqual('10.0 BN');
    expect(decimalBN.format(2)).toEqual('10.01 BN');
  });

  test('DecimalBN from method works correctly', () => {
    const decimalBN = DecimalBN.from('10.123');

    // Test if the from method correctly creates a DecimalBN instance from a string
    expect(decimalBN).toBeInstanceOf(DecimalBN);
    expect(decimalBN.toNumber()).toEqual(10.123);
  });

  test('DecimalBN fromBNString method works correctly', () => {
    const decimalBN = DecimalBN.fromBNString('10000000');

    // Test if the fromBNString method correctly creates a DecimalBN instance from a string
    expect(decimalBN).toBeInstanceOf(DecimalBN);
    expect(decimalBN.toFixed()).toEqual('0.10');
  });

  test('DecimalBN min method works correctly', () => {
    const decimalBN1 = new DecimalBN(10.123);
    const decimalBN2 = new DecimalBN(20.246);

    // Test if the min method correctly finds the minimum value between two DecimalBN instances
    const minBN = DecimalBN.min(decimalBN1, decimalBN2);

    expect(minBN.toNumber()).toEqual(10.123);
  });

  test('createDecimal - format', () => {
    const USDC = createToken('USDC', 6, 2);
    const ETH = createToken('ETH', 18, 6);

    const eth = ETH.from('5.012345678901234567890');
    const usdc = USDC.from(1.1256789);

    expect(eth.format()).toEqual('5.012345 ETH');
    expect(eth.toNumber()).toEqual(5.012345678901235);
    expect(eth.toFixed()).toEqual('5.012345');
    expect(eth.toString()).toEqual('5.012345678901234567');
    expect(eth.toBigInt()).toEqual(5012345678901234567n);

    expect(usdc.format()).toEqual('1.12 USDC');
    expect(usdc.toNumber()).toEqual(1.125678);
    expect(usdc.toString()).toEqual('1.125678');
    expect(usdc.toFixed()).toEqual('1.12');
    expect(usdc.toBigInt()).toEqual(1125678n);
  });

  test('createDecimal - operations', () => {
    const USDC = createToken('USDC', 6, 2);
    const ETH = createToken('ETH', 18, 6);

    const eth = ETH.from('5.0123456');
    const usdc = USDC.from(1.1256789);

    expect(eth.mul(usdc).div(eth).eq(usdc)).toEqual(true);
  });
});

describe('createDecimal - arithmetic operations and edge cases', () => {
  const USDC = createToken('USDC', 6, 2);
  const ETH = createToken('ETH', 18, 6);
  const BTC = createToken('BTC', 20, 8);

  test('createDecimal - adding', () => {
    const usdc1 = USDC.from(2);
    const usdc2 = USDC.from(3);

    expect(usdc1.add(usdc2).toNumber()).toEqual(5);
  });

  test('createDecimal - subtracting', () => {
    const eth1 = ETH.from(5);
    const eth2 = ETH.from(2);

    expect(eth1.sub(eth2).toNumber()).toEqual(3);
  });

  test('createDecimal - multiplying rounded number with floating number', () => {
    const btc1 = BTC.from(2);
    const btc2 = BTC.from(0.3333333333333333);

    expect(btc1.mul(btc2).format()).toEqual('0.66666666 BTC');
  });

  test('createDecimal - division edge case', () => {
    const usdc1 = USDC.from(1);
    const usdc2 = USDC.from(3);

    expect(usdc1.div(usdc2).toFixed()).toEqual('0.33');
  });

  test('createDecimal - division by zero edge case', () => {
    const eth1 = ETH.from(5);
    const eth2 = ETH.from(0);

    expect(() => eth1.div(eth2)).toThrow(Error);
  });

  test('createDecimal - parse', () => {
    const USD = createToken('USD', 2, 2);
    const usd1 = USD.parse(500);

    expect(usd1.toNumber()).toEqual(5);
  });

  test('decimal formated USD', () => {
    const USD = createToken('USD', 2, 2);
    const usdCentParsed = USD.parse(33);
    const useParsed = USD.parse(3000);
    const useParsed3013 = USD.parse(3013);

    expect(usdCentParsed.format(0)).toEqual('0 USD');
    expect(usdCentParsed.format(1)).toEqual('0.3 USD');
    expect(usdCentParsed.format(2)).toEqual('0.33 USD');

    expect(useParsed.format(1)).toEqual('30 USD');
    expect(useParsed.format(2)).toEqual('30 USD');
    expect(useParsed.format(3)).toEqual('30 USD');

    expect(useParsed3013.format(0)).toEqual('30 USD');
    expect(useParsed3013.format(1)).toEqual('30.1 USD');
    expect(useParsed3013.format(2)).toEqual('30.13 USD');
    expect(useParsed3013.format(3)).toEqual('30.130 USD');
  });
});

describe('createDecimal - deep tests', () => {
  const USDC = createToken('USDC', 6, 2);
  const ETH = createToken('ETH', 18, 6);

  test('createDecimal - toJSON', () => {
    const eth = ETH.from('1');
    const json = eth.toString();

    expect(json).toEqual('1');
  });

  test('createDecimal - fromJSON with non-standard format', () => {
    const json = '1000000000000000000e-18';
    const eth = ETH.from(json);

    expect(eth).toBeInstanceOf(ETH);
    expect(eth.toNumber()).toEqual(1);
    expect(eth.toFixed()).toEqual('1.000000');
  });

  test('createDecimal - with symbol params', () => {
    const USD = createToken('USD', 2, 2, { icon: '$', position: 'before' });
    const json = '10';
    const usd = USD.from(json);

    expect(usd).toBeInstanceOf(USD);
    expect(usd.toNumber()).toEqual(10);
    expect(usd.toFixed()).toEqual('10.00');
    expect(usd.format()).toEqual('$ 10');
  });

  test('createDecimal - with symbol params position after', () => {
    const USD = createToken('USD', 2, 2, { icon: '$', position: 'after' });
    const json = '10';
    const usd = USD.from(json);

    expect(usd).toBeInstanceOf(USD);
    expect(usd.toNumber()).toEqual(10);
    expect(usd.toFixed()).toEqual('10.00');
    expect(usd.format()).toEqual('10 $');
  });

  test('createDecimal - if symbol params are missing', () => {
    const USD = createToken('USD', 2, 2, { icon: '', position: 'before' });
    const json = '10';
    const usd = USD.from(json);

    expect(usd).toBeInstanceOf(USD);
    expect(usd.toNumber()).toEqual(10);
    expect(usd.toFixed()).toEqual('10.00');
    expect(usd.format()).toEqual('10 USD');
  });
  test('createDecimal - if symbol params are undefined', () => {
    const USD = createToken('USD', 2, 2);
    const json = '10';
    const usd = USD.from(json);

    expect(usd).toBeInstanceOf(USD);
    expect(usd.toNumber()).toEqual(10);
    expect(usd.toFixed()).toEqual('10.00');
    expect(usd.format()).toEqual('10 USD');
  });
});

describe('parseToken - deep tests', () => {
  beforeAll(() => {
    createToken('USDC', 6, 2);
    createToken('ETH', 18, 6);
  });

  test('parseToken - valid token', () => {
    const usdc = parseToken('1000 USDC');

    expect(usdc).toBeInstanceOf(DecimalBN);
    expect(usdc.toNumber()).toEqual(1000);
    expect(usdc.toFixed()).toEqual('1000.00');
  });

  test('parseToken - valid token with decimals', () => {
    const eth = parseToken('1.234567 ETH');

    expect(eth).toBeInstanceOf(DecimalBN);
    expect(eth.toNumber()).toEqual(1.234567);
    expect(eth.toFixed()).toEqual('1.234567');
  });

  test('parseToken - invalid token symbol', () => {
    expect(() => parseToken('1000 INVALID')).toThrowError('Token INVALID not found');
  });
});
// write more tests for DecimalBN.fromJSON and toJSON methods
