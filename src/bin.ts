#!/usr/bin/env node

// SPDX-FileCopyrightText: 2021 Andre Staltz
//
// SPDX-License-Identifier: MIT

import {isSsbUri} from './utils';

setTimeout(() => {
  // Dont let this CLI close before 20s
}, 20e3)

if (isSsbUri(process.argv[2])) {
  require('./handle-uri');
} else {
  require('./handle-cmd');
}
