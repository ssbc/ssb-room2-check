// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
import {startSSB} from '../ssb';

exports.command = 'sign-out <roomid>';

exports.describe = 'Input the SSB ID of the room where to sign out';

exports.builder = (yargs: any) => {
  return yargs.positional('roomid', {
    describe: 'SSB ID of the room server',
    type: 'string',
  });
};

exports.handler = async function (argv: any) {
  const {roomid} = argv;
  console.log(`Looking up the room with that ID...`);
  const ssb = startSSB();
  await sleep(3e3);
  for (const [msaddr] of ssb.conn.dbPeers()) {
    const key = Ref.getKeyFromAddress(msaddr);
    if (key === roomid) {
      console.log(`Connecting to the room...`);
      var [err] = await run(ssb.conn.connect)(msaddr);
      if (err) {
        console.error(err.message);
        await run(ssb.close)();
        await sleep(10e3);
        return;
      }
      await sleep(1000);
      console.log(`Invalidate all tokens...`);
      var [err] = await run(ssb.httpAuthClient.invalidateAllSessions)(roomid);
      if (err) {
        console.error(err.message);
        await run(ssb.close)();
        return;
      }
      console.log(`Success`);
      await run(ssb.close)();
      return
    }
  }
};
