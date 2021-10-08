// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
import {startSSB} from '../ssb';

exports.command = 'alias-register <roomid> <alias>';

exports.describe = 'Input the SSB ID of the room and the desired alias';

exports.builder = (yargs: any) => {
  return yargs
    .positional('roomid', {
      describe: 'SSB ID of the room server',
      type: 'string',
    })
    .positional('alias', {
      describe: 'Short string for your alias',
      type: 'string',
    });
};

exports.handler = async function (argv: any) {
  const {roomid, alias} = argv;
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
      console.log(`Registering alias...`);
      var [err, url] = await run(ssb.roomClient.registerAlias)(roomid, alias);
      if (err) console.error(err.message);
      else console.log(`Success: ${url}`);
      await run(ssb.close)();
      await sleep(10e3);
      return;
    }
  }
};
