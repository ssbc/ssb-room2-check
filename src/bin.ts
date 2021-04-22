#!/usr/bin/env node
import {isSsbUri} from './utils';

setTimeout(() => {
  // Dont let this CLI close before 20s
}, 20e3)

if (isSsbUri(process.argv[2])) {
  require('./handle-uri');
} else {
  require('./handle-cmd');
}
