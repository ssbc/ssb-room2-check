// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

const yargs = require('yargs/yargs');

(async () => {
  yargs(process.argv.slice(2))
    .command(require('./commands/whoami'))
    .command(require('./commands/claim'))
    .command(require('./commands/sign-in'))
    .command(require('./commands/sign-out'))
    .command(require('./commands/alias-consume'))
    .command(require('./commands/alias-register'))
    .command(require('./commands/alias-revoke'))
    .command(require('./commands/watch'))
    .demandCommand()
    .help()
    .wrap(80)
    .argv
})();
