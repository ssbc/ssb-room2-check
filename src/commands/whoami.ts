// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
import {startSSB} from '../ssb';

exports.command = 'whoami';

exports.describe = 'Display info about the SSB feed used here';

exports.builder = (yargs: any) => {};

exports.handler = async function (argv: any) {
  const ssb = startSSB();
  console.log(ssb.id);
  await sleep(200);
  await run(ssb.close)();
};
