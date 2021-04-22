const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
import {startSSB} from '../ssb';

exports.command = 'sign-in <roomid>';

exports.describe = 'Input the SSB ID of the room where to sign in';

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
      console.log(`Producing Sign-in URL...`);
      var [err, url] = await run(ssb.httpAuthClient.produceSignInWebUrl)(
        roomid,
      );
      if (err) {
        console.error(err.message);
        await run(ssb.close)();
        return;
      }
      if (url.includes('localhost')) {
        url = url.replace('localhost', 'localhost:3000');
        url = url.replace('https', 'http');
      }
      console.log(
        `Success. Open the following link in your browser ` +
          `within the next 5 minutes:\n\n${url}`,
      );
      await sleep(300e3);
      await run(ssb.close)();
      return;
    }
  }
};
