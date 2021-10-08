// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
import {startSSB} from '../ssb';

exports.command = 'alias-consume <alias>';

exports.describe = "Input an alias URL to connect to the alias's owner";

exports.builder = (yargs: any) => {
  return yargs.positional('alias', {
    describe: 'Alias URL or SSB URI',
    type: 'string',
  });
};

exports.handler = async function (argv: any) {
  const uri = argv.alias;
  const ssb = startSSB();
  console.log(`Consuming alias...`);
  const [err] = await run(ssb.roomClient.consumeAliasUri)(uri);
  if (err) console.error(err.message);
  else console.log(`Success`);
  await run(ssb.close)();
  await sleep(10e3);
  return;
};
