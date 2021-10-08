// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

import OS = require('os');
import Path = require('path');
const Caps = require('ssb-caps');
const SecretStack = require('secret-stack');
const Keys = require('ssb-keys');

export function startSSB() {
  const dummyAccount = Path.join(OS.tmpdir(), 'ssb-room2-check');
  const prodAccount = Path.join(OS.homedir(), '.ssb');
  const path = prodAccount // dummyAccount
  const secretPath = Path.join(path, 'secret');
  const keys = Keys.loadOrCreateSync(secretPath);

  return SecretStack({appKey: Caps.shs})
    .use(require('ssb-conn'))
    .use(require('ssb-room-client'))
    .use(require('ssb-http-auth-client'))
    .use(require('ssb-http-invite-client'))
    .call(null, {
      path,
      keys,
      connections: {
        incoming: {
          tunnel: [{scope: 'public', transform: 'shs'}],
        },
        outgoing: {
          net: [{transform: 'shs'}],
          ws: [{transform: 'shs'}],
          tunnel: [{transform: 'shs'}],
        },
      },
    });
}
