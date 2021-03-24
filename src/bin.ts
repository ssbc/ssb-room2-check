#!/usr/bin/env node
import {isSsbUri} from './utils';

if (isSsbUri(process.argv[2])) {
  require('./handle-uri');
} else {
  require('./handle-cmd');
}
