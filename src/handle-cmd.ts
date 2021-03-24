const yargs = require('yargs/yargs');
const run = require('promisify-tuple');
import {startSSB} from './ssb';

(async () => {
  const argv = yargs(process.argv)
    .option('whoami', {
      type: 'boolean',
      describe: 'Display info about the dummy SSB feed used here',
    })
    .option('consume-alias', {
      type: 'string',
      describe: "Input an alias URL to connect to the alias's owner",
    })
    .usage('ssb-room2-check [opts]').argv;

  if (argv.whoami) {
    const ssb = startSSB();
    console.log(ssb.id);
    await run(ssb.close)();
    return;
  }

  if (argv.consumeAlias) {
    const uri = argv.consumeAlias;
    const ssb = startSSB();
    console.log(`Consuming alias...`);
    const [err] = await run(ssb.roomClient.consumeAliasUri)(uri);
    if (err) console.error(err.message);
    else console.log(`Success`);
    return;
  }
})();
