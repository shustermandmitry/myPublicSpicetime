import { getChannel } from '../channel';

let counter = 0;

function getSomeResult(): Promise<string> {
  return Promise.resolve(`${++counter}`);
}

test('channel', async function () {
  const resultFunc = jest.fn(getSomeResult);
  const channel = getChannel(resultFunc);
  expect(await channel).toBe('1');

  expect(
    await channel.then(val => {
      expect(val).toBe('2');
      return val;
    }),
  ).toBe('2');

  await expect(Promise.resolve(channel)).resolves.toBe('3');

  expect(resultFunc.mock.calls.length).toBe(3);
});
