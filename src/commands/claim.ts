const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
import {startSSB} from '../ssb';

exports.command = 'claim <invite>';

exports.describe = 'Claim an HTTP invite to become a member of the room';

exports.builder = (yargs: any) => {
  return yargs.positional('invite', {
    describe: 'Invite URL or SSB URI',
    type: 'string',
  });
};

exports.handler = async function (argv: any) {
  const uri = argv.invite;
  const ssb = startSSB();
  console.log(`Claiming invite...`);
  var [err, msaddr] = await run(ssb.httpInviteClient.claim)(uri);
  if (err) {
    console.error(err.message);
    await run(ssb.close)();
    await sleep(10e3);
    return;
  }
  console.log(`Connecting to the room...`);
  await sleep(200);
  var [err] = await run(ssb.conn.connect)(msaddr);
  if (err) {
    console.error(err.message);
    await run(ssb.close)();
    await sleep(10e3);
    return;
  }
  console.log(`Storing the room's address in ConnDB...`);
  const key = Ref.getKeyFromAddress(msaddr);
  var [err] = await run(ssb.conn.remember)(msaddr, {type: 'room', key});
  if (err) {
    console.error(err.message);
    await run(ssb.close)();
    await sleep(10e3);
    return;
  } else console.log(`Success`);
  await run(ssb.close)();
  await sleep(10e3);
};
