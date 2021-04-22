const cliWidth = require('cli-width');
const pad = require('pad');
const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
const pkg = require('../package.json');
import {startSSB} from './ssb';

const uri = process.argv[2];
const u = new URL(uri);

function printHorizontalLine() {
  console.log('\n' + Array(cliWidth()).fill('-').join('') + '\n');
}

// Header
console.log(`ssb-room2-check@${pkg.version}`);

printHorizontalLine();

// Generic info about the SSB URI
console.log(`Detected SSB URI:\n    ${uri}\n`);
console.log('Query params:');
let longest = 0;
u.searchParams.forEach((_val, name) => {
  longest = Math.max(name.length, longest);
});
u.searchParams.forEach((val, name) => {
  console.log(`    * ${pad(name, longest + 2)}${val}`);
});

printHorizontalLine();

// Execute scenarios
(async () => {
  const action = u.searchParams.get('action');

  if (action === 'consume-alias') {
    const ssb = startSSB();
    console.log(`Consuming alias...`);
    await sleep(300);
    const [err] = await run(ssb.roomClient.consumeAliasUri)(uri);
    if (err) console.error(err.message);
    else console.log(`Success`);
    printHorizontalLine();
  }

  if (action === 'start-http-auth') {
    const ssb = startSSB();
    console.log(`Signing-in to server...`);
    await sleep(300);
    const [err] = await run(ssb.httpAuthClient.consumeSignInSsbUri)(uri);
    if (err) console.error(err.message);
    else console.log(`Success`);
    printHorizontalLine();
  }

  if (action === 'claim-http-invite') {
    const ssb = startSSB();
    await sleep(300);
    console.log(`Claiming invite...`);
    var [err, msaddr] = await run(ssb.roomClient.claimInviteUri)(uri);
    if (err) {
      console.error(err.message);
      await sleep(10e3);
      await run(ssb.close)();
      return;
    }
    console.log(`Connecting to the room...`);
    await sleep(200);
    var [err] = await run(ssb.conn.connect)(msaddr);
    if (err) {
      console.error(err.message);
      await sleep(10e3);
      await run(ssb.close)();
      return;
    }
    console.log(`Storing the room's address in ConnDB...`);
    const key = Ref.getKeyFromAddress(msaddr);
    var [err] = await run(ssb.conn.remember)(msaddr, {type: 'room', key});
    if (err) {
      console.error(err.message);
      await sleep(10e3);
      await run(ssb.close)();
      return;
    } else console.log(`Success`);
    printHorizontalLine();
  }

  console.log('Done. This will close in 30 seconds.');
  await sleep(30e3);
})();
