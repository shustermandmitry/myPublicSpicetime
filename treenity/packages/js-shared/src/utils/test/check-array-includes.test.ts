const arr = [
  'handle',
  'set',
  'service',
  'services',
  'events',
  'hooks',
  'on',
  'off',

  'emit',
  'publish',
  'setup',
  'teardown',
  'splice',
  'then',
  'catch',
  'getCustomMethods',
  'getCustomEvents',
  'once',
];
const sortedArr = arr.slice().sort();
const obj = Object.fromEntries(arr.map(v => [v, true]));
const check = ['events', 'splice', 'then', 'once', 'not-exits', 'not-exits-too', 'off'];
const results = [true, true, true, true, false, false];

const ITERATIONS = 10_000_000;

/**
 * this tests different approaches to say if something exists in array
 */
describe.skip('check existance of element in array performance test', () => {
  beforeAll(() => {});

  test('object field', () => {
    let resBool = false;
    for (let n = 0; n < ITERATIONS; n++) {
      for (let field of check) resBool = obj[field] === true;
    }
    expect(resBool).toEqual(true);
  });
  test('array includes', () => {
    let resBool = false;
    for (let n = 0; n < ITERATIONS; n++) {
      for (let field of check) resBool = arr.includes(field);
    }
    expect(resBool).toEqual(true);
  });
  test('array indexOf', () => {
    let resBool = false;
    for (let n = 0; n < ITERATIONS; n++) {
      for (let field of check) resBool = arr.indexOf(field) >= 0;
    }
    expect(resBool).toEqual(true);
  });

  test('iterate in sorted array', () => {
    let resBool = false;
    for (let n = 0; n < ITERATIONS; n++) {
      for (let field of check) {
        for (let i = 0; i < sortedArr.length; i++) {
          if (sortedArr[i] >= field) {
            resBool = sortedArr[i] === field;
            break;
          }
        }
      }
    }
    expect(resBool).toEqual(true);
  });

  // import bs from 'binary-search';
  // test('binary search', () => {
  //   const comp = (cur: string, exp: string) => cur.localeCompare(exp);
  //
  //   let resBool = false;
  //   for (let n = 0; n < ITERATIONS; n++) {
  //     for (let field of check) {
  //       resBool = bs(sortedArr, field, comp) >= 0;
  //     }
  //   }
  //   expect(resBool).toEqual(true);
  // });

  test('using set', () => {
    const set = new Set(arr);

    let resBool = false;
    for (let n = 0; n < ITERATIONS; n++) {
      for (let field of check) {
        resBool = set.has(field);
      }
    }
    expect(resBool).toEqual(true);
  });
});
