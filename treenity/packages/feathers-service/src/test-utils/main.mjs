import { socket } from '@feathersjs/transport-commons';

export const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {


  const s = socket;

  await wait(1000);
}

main().then(console.log, console.error);
